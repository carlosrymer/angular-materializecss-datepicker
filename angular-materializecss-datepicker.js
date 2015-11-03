(function() {

	'use strict';

	function _buildRow(options) {
		var row                  = [],
				currentMonthAndYear  = options.date.getMonth() === options.now.getMonth() && options.date.getFullYear() === options.now.getFullYear(),
				selectedMonthAndYear = options.date.getMonth() === options.selectedDate.getMonth() && options.selectedDate.getFullYear() === options.date.getFullYear(),
				isVisible;

		for (var i = options.firstDay; i < options.lastDay; i++) {
			isVisible = i >= 0 && i < options.daysInMonth && !(currentMonthAndYear && (new Date()).getDate() > (i + 1));

			row.push({
				isToday  : isVisible && (options.now.getDate() - 1) === i,
				selected : currentMonthAndYear && (options.selectedDate.getDate() - 1) === i,
				value    : i + 1,
				visible  : isVisible
			});
		}

		return row;
	}

	function _daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
	}

	function _getFirstDay(year, month) {
		return (new Date(year, month, 1)).getDay();
	}

	function _getRows(date, selectedDate) {
		var firstDay     = _getFirstDay(date.getFullYear(), date.getMonth()),
				daysInMonth  = _daysInMonth(date.getFullYear(), date.getMonth()),
				daysInView   = daysInMonth + firstDay,
				numberOfRows = Math.round(daysInView/7),
				rows         = [],
				options      = {
					date         : new Date(date.getTime()),
					daysInMonth  : daysInMonth,
					now          : new Date(),
					selectedDate : new Date(selectedDate.getTime()),
					startDay     : firstDay
				};

		for (var i = 0; i < numberOfRows; i++) {
			options.firstDay = (i * 7) - firstDay;
			options.lastDay  = options.firstDay + 7;

			rows.push(_buildRow(options));
		}

		return rows;
	}

	function _getYears() {
		return [1].reduce(function(previous, current) {
			previous.push(previous[previous.length - 1] + 1); 

			return previous;
		}, [(new Date()).getFullYear()]);
	}

	/**
	 * Materialize Date Picker Directive Controller
	 * @param {Object.Service} $compile 
	 * @param {Object.Element} $element
	 * @param {Object.Service} $filter
	 * @param {Object.Scope} $rootScope
	 * @param {Object.Scope} $scope
	 * @param {Object.Service} $templateCache
	 * @param {Object.Constant} DatePickerYears
	 */
	function MaterializeDatePickerCtrl($compile, $element, $filter, $rootScope, $scope, $templateCache, DatePickerYears) {
		var self  = this,
				tpl   = $templateCache.get('angular-materializecss-datepicker.tpl.html'),
				now   = new Date(),
				model = $element.controller('ngModel'),
				date  = model.$modelValue && new Date(model.$modelValue) >= now ? new Date(model.$modelValue) : now,
				picker;

		angular.extend(this, {
			disableNextMonth     : date.getFullYear() === (now.getFullYear() + 1) && date.getMonth() === 11,
			disablePreviousMonth : date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth(),
			selectedDate         : date,
			view                 : {
				date : new Date(date.getTime()),
				rows : _getRows(date, date),
				year : date.getFullYear()
			},
			years                : DatePickerYears
		});

		function _close() {
			if (picker) {
				picker.remove();
			}
		}

		function _open(e) {
			picker = $compile(tpl)($scope);

			$element.after(picker);
			e.preventDefault();

			angular.element(picker[0].querySelector('.picker__holder')).on('click', _close);
			angular.element(picker[0].querySelector('.picker__wrap')).on('click', function(e) {
				e.stopPropagation();
			});
		}

		function _update(date) {
			model.$setViewValue($filter('date')(date, 'longDate'));
			model.$render();
		}

		this.clear = function() {
			model.$setViewValue(null);
			model.$render();

			this.view.date    = new Date();
			this.selectedDate = new Date(this.view.date.getTime());

			this.updateView();

			_close();
		};

		this.close = function() {
			$rootScope.$broadcast('datepicker:close');
		};

		this.goToNextMonth = function() {
			var currentDate  = this.view.date.getDate(),
					currentMonth = this.view.date.getMonth(),
					currentYear  = now.getFullYear(),
					year  			 = currentMonth === 11 ? this.view.date.getFullYear() + 1 : this.view.date.getFullYear(),
					month 			 = currentMonth === 11 ? 0 : currentMonth + 1,
					days         = _daysInMonth(year, month),
					date         = currentDate > days ? days : currentDate;

			this.view.date = new Date(year, month, date, 0, 0, 0);
			this.view.year = year;

			angular.extend(this, {
				disableNextMonth     : year === (currentYear + 1) && month === 11,
				disablePreviousMonth : year === currentYear && month === now.getMonth()
			});

			this.updateView();
		};

		this.goToPreviousMonth = function() {
			var currentDate  = this.view.date.getDate(),
					currentMonth = this.view.date.getMonth(),
					currentYear  = now.getFullYear(),
					year  			 = !currentMonth ? this.view.date.getFullYear() - 1 : this.view.date.getFullYear(),
					month 			 = !currentMonth ? 11 : currentMonth - 1,
					days         = _daysInMonth(year, month),
					date         = currentDate > days ? days : currentDate;

			this.view.date = new Date(year, month, date, 0, 0, 0);
			this.view.year = year;

			angular.extend(this, {
				disableNextMonth     : year === (currentYear + 1) && month === 11,
				disablePreviousMonth : year === currentYear && month === now.getMonth()
			});

			this.updateView();
		};

		this.selectDay = function(day) {
			this.selectedDate.setDate(day.value);

			this.view.date = new Date(this.selectedDate.getTime());

			this.updateView();

			_update(this.view.date);
		};

		this.selectToday = function() {
			this.view.date    = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
			this.selectedDate = new Date(this.view.date.getTime());

			this.updateView();
			_update(this.view.date);
			_close();
		};

		this.selectYear = function() {
			var currentDate  = this.view.date.getDate(),
					currentMonth = this.view.date.getMonth(),
					currentYear  = now.getFullYear(),
					year  			 = this.view.date.getFullYear(),
					days         = _daysInMonth(year, currentMonth),
					date         = currentDate > days ? days : currentDate;

			this.view.date = new Date(year, currentMonth, date, 0, 0, 0);
			this.view.year = year;

			angular.extend(this, {
				disableNextMonth     : year === (currentYear + 1) && currentMonth === 11,
				disablePreviousMonth : year === currentYear && currentMonth === now.getMonth()
			});

			this.updateView();
		};

		this.updateView = function() {
			this.view.rows = _getRows(this.view.date, this.selectedDate || now);
		};

		$element.on('click', _open);
		$scope.$on('datepicker:close', _close);
	}

	MaterializeDatePickerCtrl.$inject = [
		'$compile',
		'$element',
		'$filter',
		'$rootScope',
		'$scope',
		'$templateCache',
		'DatePickerYears'
	];

	function materializeDatePickerDirective() {
		return {
			controller   : 'MaterializeDatePickerCtrl',
			controllerAs : 'MaterializeDatePicker',
			replace      : false,
			require      : 'ngModel',
			restrict     : 'AE',
			scope        : true
		};
	}

	angular.module('angularMaterializeDatePicker', [
		'angularMaterializeDatePickerTemplate'
	])
		.constant('DatePickerYears', _getYears())
		.controller('MaterializeDatePickerCtrl', MaterializeDatePickerCtrl)
		.directive('materializeDatePicker', materializeDatePickerDirective);

})();