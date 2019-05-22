/** @license
 *
 *             Keyboard Datepicker plugin v1.0.0
 *
 *             Copyright (c) 2019 Bablu Ahmed, https://github.com/bablukpik/keyboard-datepicker
 *             Licensed under the MIT License.
 *             http://opensource.org/licenses/mit-license
 *
 *             * /if (typeof window === 'object') window.keyboardDatepicker = '" + newVersion + "';/*"
 *
 */

$(document).ready(function () {
    // initialization
    $('.datepicker').datepicker({
        format: "dd-mm-yyyy",
        todayHighlight: true,
        autoclose: true
    }).datepicker("setDate", 'now');

    // essential properties
    const newDate = new Date();
    let rawInputDay;
    let rawInputMonth;
    let rawInputYear;
    const monthNamesArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const monthNamesObj = {"Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sept": 8, "Oct": 9, "Nov": 10, "Dec": 11};

    /*default date area*/
    let isHiddenDateVal = $('.bdpicker_hidden_input').val();
    const getDate = string => (([day, month, year]) => ({ year, month, day }))(string.split('-'));
    let isHiddenDateObj = getDate(isHiddenDateVal);
    // check date is set for update or not
    if(!isHiddenDateVal) {
        $('.bdday').val(("0" + newDate.getDate()).slice(-2));
        $('.bdmonth').val(monthNamesArr[newDate.getMonth()]);
        $('.bdyear').val(newDate.getFullYear());
        $('.bdpicker_hidden_input').val(
            $('.datepicker').data('datepicker').getFormattedDate('dd-mm-yyyy') // set current date for hidden field
        );
    } else {
        $('.bdday').val(isHiddenDateObj.day);
        $('.bdmonth').val(monthNamesArr[parseInt(isHiddenDateObj.month)-1]);
        $('.bdyear').val(isHiddenDateObj.year);
        $(".datepicker").datepicker("update", isHiddenDateVal); // update datepicker's value
    }

    // return parse max day of the inputed month
    let maxdayFn = function (m, y) {
        return new Date(y, m + 1, 0).getDate();
    };

    // return max day of the inputed month
    function maxDaysInMonth(m, y) { // m is 0 indexed: 0-11
        switch (m) {
            case 1 :
                return (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0)) ? 29 : 28;
            case 8 :
            case 3 :
            case 5 :
            case 10 :
                return 30;
            default :
                return 31
        }
    }

    // return true/false of the inputed full date
    function isValidDate(d, m, y) { // m is 0 indexed: 0-11
        return m >= 0 && m < 12 && d > 0 && d <= maxDaysInMonth(m, y);
    }

    // return true/false of the inputed day
    function isValidDay(d, m, y) { // m is 0 indexed: 0-11
        return d > 0 && d <= maxDaysInMonth(m, y);
    }

    // return true/false of the inputed month
    function isValidMonth(m) { // m is 0 indexed: 0-11
        return m >= 0 && m < 12;
    }

    // return true/false of the inputed year
    function isValidYear(year) {
        if (isNaN(year)) {
            return false;
        }

        let text = /^[0-9]+$/;
        if (!year && !text.test(year)) {
            return false;
        }

        return true;
    }

    // custom bootstrap datepicker main function
    function customBootstrapDatepicker(thisElement) {
        let inputGroup = thisElement.closest('.input-group');
        //let day = rawInputDay = ('.bdday').val();
        let day = rawInputDay = inputGroup.find('.bdday').val();
        let month = rawInputMonth = inputGroup.find('.bdmonth').val();
        let year = rawInputYear = inputGroup.find('.bdyear').val();

        // month setting
        if (!isNaN(month)) {
            month = monthNamesArr[month - 1];
            inputGroup.find('.bdmonth').val(month);
        }

        // year setting
        if ((year.toString()).length < 3) {
            let yearLastStr = '';
            if ((year.toString()).length == 1) {
                yearLastStr = '0' + year.toString();
            }
            if ((year.toString()).length == 2) {
                yearLastStr = year.toString();
            }

            let thisYear = new Date().getFullYear().toString();
            thisYear = thisYear.substring(0, thisYear.length - 2);
            thisYear = thisYear + yearLastStr;
            year = parseInt(thisYear);
            inputGroup.find('.bdyear').val(year);
        }
        if ((year.toString()).length == 3 || (year.toString()).length > 4) {
            inputGroup.find('.bdyear').val(new Date().getFullYear());
            year = new Date().getFullYear();
        }

        // check the full date is valid or not
        /*if(!isValidDate(day,monthNamesObj[month],year)) //month is str ie. Jan, Feb ...
        {
            $('.bdday').val('0');
        }*/

        // check day is valid or not if not set valid
        if (!isValidDay(day, monthNamesObj[month], year)) {
            // $('.bdday').val('0');
            day = maxDaysInMonth(monthNamesObj[month], year);
            inputGroup.find('.bdday').val(day);
            inputGroup.find('.bdday').select();
            return false;
        }

        // check month is valid or not
        if (!isValidMonth(monthNamesObj[month])) {
            //$('.bdmonth').val('0');
            month = monthNamesArr[new Date().getMonth()];
            inputGroup.find('.bdmonth').val(month);
            inputGroup.find('.bdmonth').select();
            return false;
        }

        // check year is valid or not
        if (!isValidYear(year)) {
            //$('.bdyear').val('0');
            year = new Date().getFullYear();
            inputGroup.find('.bdyear').val(year);
            inputGroup.find('.bdyear').select();
            return false;
        }

        // set the parsed full date to hidden input field
        let formatedDate = day + '-' + monthNamesObj[month] + '-' + year;
        inputGroup.find('.bdpicker_hidden_input').val(formatedDate);

        // set the parsed full date to the datepicker
        formatedDate = day + '-' + (monthNamesObj[month] + 1) + '-' + year;
        //$('.datepicker').datepicker('setDate', formatedDate);
        inputGroup.find('.datepicker').datepicker('setDate', formatedDate);
    }

    // the datepicker change event for change the values of all input fields
    $(document).on('changeDate', '.datepicker', function (event) {
        event.stopPropagation();
        //console.log(event.date);
        let inputGroup = $(this).closest('.input-group');
        /*let month = $(".datepicker").data('datepicker').getFormattedDate('mm');*/
        let month = inputGroup.find('.datepicker').data('datepicker').getFormattedDate('mm');
        let year = inputGroup.find('.datepicker').data('datepicker').getFormattedDate('yyyy');
        month = monthNamesArr[month - 1];

        inputGroup.find('.bdpicker_hidden_input').val(
            inputGroup.find('.datepicker').data('datepicker').getFormattedDate('dd-mm-yyyy')
        );
        inputGroup.find('.bdday').val(
            inputGroup.find('.datepicker').data('datepicker').getFormattedDate('dd')
        );
        inputGroup.find('.bdmonth').val(month);
        inputGroup.find('.bdyear').val(year);
    });

    // for all date field on blur, paste or click the event will be fired
    $(document).on('blur paste click', '.dateField', function (e) {
        $('.datepicker').datepicker('hide');
        let thisElement = $(this);
        customBootstrapDatepicker(thisElement);
    });

    // the click trigger for the datepicker popup open
    $('.datepickerTrigger').click(function () {
        $(this).find('.datepicker').datepicker('show');
    });

    // arrow key events
    $(document).on('keyup', '.dateField', function (e) {
        //let thisRow = $(this).closest('tr');
        if (e.keyCode == 37) { // left key
            //thisRow.prev().find('.OFFICIAL_NO').focus();
            $(this).prev().focus().select();
        }
        if (e.keyCode == 39) // right key
        {
            //thisRow.next().find('.OFFICIAL_NO').focus();
            $(this).next().focus().select();
        }
    });

    // on key up event for month
    $(document).on('keyup', '.bdmonth', function (e) {
        $('.datepicker').datepicker('hide');
        let thisElement = $(this);
        setTimeout(function () {
            customBootstrapDatepicker(thisElement);
        }, 300);
    });
});
