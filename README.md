# MaterializeCSS Angular DatePicker Directive

An AngularJS directive for the [MaterializeCSS Framework's DatePicker](http://materializecss.com/forms.html#date-picker).

## Installation

Through bower:

```
bower install angular-materializecss-datepicker
```

Through npm

```
npm install angular-materializecss-datepicker
```

## Usage

Include MaterializeCSS in your app:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.1/css/materialize.min.css">
```

Include both Angular.js and the Angular Materialize DatePicker directive in your app:

```html
<script src="components/angular/angular.js"></script>
<script src="components/angular-materializecss-datepicker/angular-materializecss-datepicker.js"></script>
```

Add the module angularMaterializeDatePicker in your app:

```javascript
var myapp = angular.module('myapp', ['angularMaterializeDatePicker']);
```

Use the directive on input controls:

```html
<div class="input-field">
	<input name="someDate" ng-model="SomeController.someDate" type="text" class="datepicker" materialize-date-picker readonly />
	<label ng-class="{active: SomeController.someDate.length}">
		Some Date
	</label>
</div>
```

## License

Released under the terms of the [MIT License](LICENSE).