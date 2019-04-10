/**
 * Created by streetcoder on 1/23/16.
 */

(function($) {

/* custom code should be here */

    $('.datatableByClass').DataTable({
        responsive: true,

        aoColumnDefs: [
            {
                bSortable: false,
                aTargets: [ -1 ]
            }
        ]
    });

    $('#datatable thead tr#filterrow th').each( function () {
        var title = $('#datatable thead th').eq( $(this).index() ).text();
        $(this).html( '<input type="text" onclick="stopPropagation(event);" placeholder="'+title+'" />' );
    } );

    var table = $('#datatable').DataTable({
        responsive: true,

        aoColumnDefs: [
            {
                bSortable: false,
                aTargets: [ -1 ]
            }
        ]
    });


    $("#datatable thead input").on( 'keyup change', function () {
        table
            .column( $(this).parent().index()+':visible' )
            .search( this.value )
            .draw();
    } );

    function stopPropagation(evt) {
        if (evt.stopPropagation !== undefined) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }


})(jQuery); // Fully reference jQuery after this point.

