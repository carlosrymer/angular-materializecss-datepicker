describe('Angular MaterializeCSS DatePicker', function() {
	beforeEach(module('angularMaterializeDatePicker'));

	describe('DatePicker without a selected future date', function() {
		var controller,
				element,
				$scope,
				$templateCache;

		beforeEach(inject(function(_$templateCache_, $compile, $rootScope) {
			var template       = '<input name="date" ng-model="date" type="text" class="datepicker" materialize-date-picker readonly />';

			
			$templateCache = _$templateCache_;

			spyOn($templateCache, 'get').and.callThrough();

			$scope  = angular.extend($rootScope.$new(), {
				date : new Date()
			});
			element = $compile(template)($scope);

			$scope.$digest();

			controller = element.scope().MaterializeDatePicker;
		}));

		it('should have the previous month button disabled by default when on the current date', function() {
			expect(controller.disablePreviousMonth).toBe(true);
		});

		it('should have the next month button enabled by default when on the current date', function() {
			expect(controller.disableNextMonth).toBe(false);
		});

		it('should have loaded the datepicker template', function() {
			expect($templateCache.get).toHaveBeenCalledWith('angular-materializecss-datepicker.tpl.html');
		});

		it('should have the selected date equal the provided date', function() {
			expect(controller.selectedDate.getDate()).toEqual($scope.date.getDate());
			expect(controller.selectedDate.getMonth()).toEqual($scope.date.getMonth());
			expect(controller.selectedDate.getFullYear()).toEqual($scope.date.getFullYear());
		});

		it('should have the view date equal the provided date', function() {
			expect(controller.view.date.getDate()).toEqual($scope.date.getDate());
			expect(controller.view.date.getMonth()).toEqual($scope.date.getMonth());
			expect(controller.view.date.getFullYear()).toEqual($scope.date.getFullYear());
		});

		it('should have an array of the next two years, inclusive', function() {
			expect(controller.years).toEqual([$scope.date.getFullYear(), $scope.date.getFullYear() + 1]);
		});

		it('should be able to go to the next month and switch to the previous month', function() {
			var currentMonth = $scope.date.getMonth();

			spyOn(controller, 'updateView').and.callThrough();

			controller.goToNextMonth();

			expect(controller.view.date.getMonth()).toEqual(currentMonth === 11 ? 0 : currentMonth + 1);
			expect(controller.disablePreviousMonth).toEqual(false);

			controller.goToPreviousMonth();

			expect(controller.view.date.getMonth()).toEqual(currentMonth);
			expect(controller.disablePreviousMonth).toEqual(true);
			expect(controller.updateView.calls.count()).toEqual(2);
		});

		it('should be able to select a different year', function() {
			var currentYear = controller.view.date.getFullYear();

			controller.view.date.setFullYear(currentYear + 1);

			controller.selectYear();

			expect(controller.view.year).toEqual(currentYear + 1);
		});

		it('should be able to select any visible day', function() {
			var currentDate = controller.view.date.getDate(),
					day         = {
						value : currentDate >= 28 ? currentDate - 1 : currentDate
					};

			controller.goToNextMonth();

			spyOn(controller, 'updateView').and.callThrough();

			controller.selectDay(day);

			expect(controller.selectedDate.getDate()).toEqual(day.value);
			expect(controller.selectedDate.getTime()).toEqual(controller.view.date.getTime());
			expect(controller.updateView).toHaveBeenCalled();
		});

		it('should be able to go back to the current day regardless of which day is selected', function() {
			var currentDate  = controller.view.date.getDate(),
					currentMonth = controller.view.date.getMonth(),
					currentYear  = controller.view.date.getFullYear(),
					day          = {
						value : currentDate >= 28 ? currentDate - 1 : currentDate
					};

			controller.goToNextMonth();
			controller.selectDay(day);

			spyOn(controller, 'updateView').and.callThrough();

			controller.selectToday();

			expect(controller.view.date.getDate()).toEqual(currentDate);
			expect(controller.view.date.getMonth()).toEqual(currentMonth);
			expect(controller.view.date.getFullYear()).toEqual(currentYear);
			expect(controller.selectedDate.getTime()).toEqual(controller.view.date.getTime());
			expect(controller.updateView).toHaveBeenCalled();
		});

		it('should open the date picker when clicking on the input', function() {
			spyOn(angular.element.prototype, 'on').and.callThrough();
			element.triggerHandler('click');

			expect(angular.element.prototype.on).toHaveBeenCalled();
		});

		it('should close the date picker if it is open', function() {
			element.triggerHandler('click');

			spyOn(angular.element.prototype, 'remove').and.callThrough();

			controller.close();

			$scope.$digest();

			expect(angular.element.prototype.remove).toHaveBeenCalled();
		});

		it('should prevent propagation to the document when clicking anywhere on the date picker', function() {
			var e = {
				type            : 'click',
				stopPropagation : jasmine.createSpy('stopPropagation')
			};

			element.triggerHandler('click');

			angular.element(element.next()[0].querySelector('.picker__wrap')).triggerHandler(e);

			$scope.$digest();

			expect(e.stopPropagation).toHaveBeenCalled();
		});

		it('should clear the selected date', function() {
			var currentDate = controller.view.date.getDate(),
					day         = {
						value : currentDate >= 28 ? currentDate - 1 : currentDate
					},
					now         = new Date();

			controller.goToNextMonth();

			controller.selectDay(day);

			controller.clear();

			expect(controller.view.date.getDate()).toEqual(now.getDate());
			expect(controller.view.date.getMonth()).toEqual(now.getMonth());

			expect(controller.selectedDate.getDate()).toEqual(now.getDate());
			expect(controller.selectedDate.getMonth()).toEqual(now.getMonth());
		});
	});

	describe('DatePicker with a selected future date', function() {
		var controller,
				element,
				$scope;

		beforeEach(inject(function($compile, $rootScope) {
			var template       = '<input name="date" ng-model="date" type="text" class="datepicker" materialize-date-picker readonly />',
					now = new Date();

			now.setFullYear(now.getFullYear() + 1);
			now.setMonth(0);
			now.setDate(1);

			$scope  = angular.extend($rootScope.$new(), {
				date : now.toJSON()
			});
			element = $compile(template)($scope);

			element.controller('ngModel').$setViewValue(now.toJSON());

			$scope.$digest();

			controller = element.scope().MaterializeDatePicker;
		}));
	});
});