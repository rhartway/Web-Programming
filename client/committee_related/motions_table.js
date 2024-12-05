const motionsTable = document.getElementById('motionsTable');
const tableBody = document.getElementById('tableBody');

async function fetchMotionByCommittee()
{
  //get committee key from url
  const queryParams = new URLSearchParams(window.location.search);
  const committeeKey = queryParams.get('committeeKey');

  //fetch motions by committee(key)
  const motionsByCommittee = await fetch(`${server}/api/motions/${committeeKey}`);

  if (motionsByCommittee.ok)
  {
    //load associated motions into table
    const motions = await motionsByCommittee.json();
    loadMotionsTable(motions);
  }
  else
  {
    console.log("failed to fetch motions by committee");
  }
}



async function loadMotionsTable(motions) {
  //hi
  //console.log("hi this is the motions: ", motions);
  motions.forEach( item => {
    let row = tableBody.insertRow();
    row.id = item.motionKey; //set motionID as identifier

    //motion name cell
    let motion = row.insertCell(0);
      //populate cell with motion name and link to motion
    let motionLink = document.createElement('a');
    //motionLink.setAttribute("href", `/chatroom/${item.motionKey}`); // Link to chatroom
    motionLink.setAttribute("href", `/chatroom`); // Link to chatroom

    let linkText = document.createTextNode(item.title);
    motionLink.appendChild(linkText);

    motion.appendChild(motionLink);

    //description cell
    let description = row.insertCell(1);
    let descriptionText = document.createTextNode(item.description);
    description.appendChild(descriptionText);

    //creator cell
    let creator = row.insertCell(2);
    let creatorText = document.createTextNode(item.creator);
    creator.appendChild(creatorText);

    //date cell
    let date = row.insertCell(3);
    let dateText = document.createTextNode(item.date);
    date.appendChild(dateText);
  })
}





fetchMotionByCommittee();


$(document).ready(function() {
    setTimeout(function() {
      function cbDropdown(column) {
        return $('<ul>', {
          'class': 'cb-dropdown'
        }).appendTo($('<div>', {
          'class': 'cb-dropdown-wrap'
        }).appendTo(column));
    
      }
    
      $('#motionsTable').DataTable({
        bAutoWidth: false, 
        aoColumns : [
          { sWidth: '25%' }, //org
          { sWidth: '25%' }, //filename
          { sWidth: '25%' }, //year
          { sWidth: '25%' }, //edition
        ],
        responsive: true,
        columnDefs: [
          {
            targets: 0,
            render: function (data, type, row) {
              if (type === 'filter') {
                if ( data.includes( 'href' ) ) {
                  return $(data).text();
                }
                return data;
              }
              return data;
            }
          }
        ],
        initComplete: function() {
          this.api()
          .columns()
          .every(function(index) 
          {
            if (index == 2) //menu for creator bc others don't really make sense
            {
                    var column = this;
                    var ddmenu = cbDropdown($(column.header()))
                      .on('change', ':checkbox', function() {
                        var active;
                        var vals = $(':checked', ddmenu).map(function(index, element) {
                          active = true;
                          return $.fn.dataTable.util.escapeRegex($(element).val());
                        }).toArray().join('|');
            
                        column
                          .search(vals.length > 0 ? '^(' + vals + ')$' : '', true, false)
                          .draw();
            
                        // Highlight the current item if selected.
                        if (this.checked) {
                          $(this).closest('li').addClass('active');
                        } else {
                          $(this).closest('li').removeClass('active');
                        }
            
                        // Highlight the current filter if selected.
                        var active2 = ddmenu.parent().is('.active');
                        if (active && !active2) {
                          ddmenu.parent().addClass('active');
                        } else if (!active && active2) {
                          ddmenu.parent().removeClass('active');
                        }
                      
                      });
              
                    //. Keep track of the select options to not duplicate
                    var selectOptions = [];
                    column.data().unique().sort().each(function(d, j) {
                      
                      // Use jQuery to get the text if the cell is a link
                      if ( d.includes( 'href' ) ) {
                        d = $(d).text();
                      }
                      
                      if ( ! selectOptions.includes( d ) ) {
                        
                        selectOptions.push( d );
                        
                        var // wrapped
                        $label = $('<label>'),
                            $text = $('<span>', {
                              text: d
                            }),
                            $cb = $('<input>', {
                              type: 'checkbox',
                              value: d
                            });
            
                        $text.appendTo($label);
                        $cb.appendTo($label);
            
                        ddmenu.append($('<li>').append($label));
                      }
                    });
          }
           
          });
        }
      });
  }, 400); //small delay because this loads faster than data

  
});