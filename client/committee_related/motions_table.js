const motionsTable = document.getElementById('motionsTable');
const tableBody = document.getElementById('tableBody');
let currentUserData = JSON.parse(sessionStorage.getItem("userInfo"));
let currentUserNum = currentUserData.userData.key;
let currentUserFName = currentUserData.userData.fname;
let currentUserLname = currentUserData.userData.lname;



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

  //let chairmanKey = committeeData.committeeInfo.chairmanID;
  //console.log(chairmanKey);
  console.log(sessionStorage.getItem("userInfo"));
  let currentCommittee = JSON.parse(sessionStorage.getItem("committeeInfo"));
  let chairmanKey = currentCommittee.committeeAtKey[0].chairmanID; 
  console.log(chairmanKey);
  motions.forEach( async (item) => {

    let row = tableBody.insertRow();
    row.id = item.motionKey; //set motionID as identifier
    //row.style.backgroundColor = "green";

    //motion name cell
    let motion = row.insertCell(0);
      //populate cell with motion name and link to motion
    let motionLink = document.createElement('a');
    motionLink.setAttribute("href", `/chatroom/${item.motionKey}`); // Link to chatroom
    //motionLink.setAttribute("href", `/chatroom/$(item.motionKey)`); // Link to chatroom

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

    // get votes for each motion
    let votesNum = 0;
    const countVotes = await fetch(`${server}/api/motion/getVotes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        motionNum: item.motionKey
      })
    });

    if (countVotes.ok) {
      const votesResponse = await countVotes.json();
      votesNum = votesResponse.votes;
      console.log(votesNum);
    }
    else {
      console.log("could not count votes");
    }

    // upvote Button
    let upvote = row.insertCell(4);
    let upvoteDiv = document.createElement("div");
    let upvoteNum = document.createElement("p");
    upvoteNum.setAttribute("id", `motion-${item.motionKey}-upvoteCount`);
    upvoteNum.textContent = votesNum;
    let upvoteButton = document.createElement("button");

    upvoteDiv.style = 'display: flex; gap: 5px; justify-content: center';
    upvoteButton.setAttribute(`id`, `motion-${item.motionKey}-upvote`);
    upvoteButton.setAttribute("class", "upvoteButton");
    upvoteButton.textContent = "upvote";

    upvoteButton.addEventListener("click", async (event) => {
        const upvoteResponse = await fetch(`${server}/api/motion/vote`, {
          method: "POST", 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userID: currentUserNum,
            motionID: item.motionKey
          })
        });

        if (upvoteResponse.ok) {
            // rerender with updated votes
            const numVotes = await upvoteResponse.json();
            document.getElementById(`motion-${item.motionKey}-upvoteCount`).textContent = numVotes.votes;
            if (numVotes.votes >= votesNeeded) {
              row.style.backgroundColor = 'green';
            }
            else {
              row.style.backgroundColor = 'black';
            }
            
        }
        else {
            console.log("Could not update vote");
        } 
    });

    upvoteDiv.appendChild(upvoteButton);
    upvoteDiv.appendChild(upvoteNum);
    upvote.appendChild(upvoteDiv);

    let votesNeeded = await document.getElementById("votesToPass").textContent.split(" ")[4];
    console.log(votesNeeded);
    
    if (votesNum >= votesNeeded) {
      row.style.backgroundColor = 'green';
    }
    else {
      row.style.backgroundColor = 'black';
    }


    let endVoting = row.insertCell(5);
    let endButton = document.createElement("button");
    endButton.setAttribute("id", `motion-${item.motionKey}-end`);
    endButton.setAttribute("class", "endVoteButton");
    endButton.textContent = 'End Vote';

    if (currentUserNum != chairmanKey) {
      endButton.setAttribute("disabled", "true");
    }

    endVoting.appendChild(endButton);


    // downvote Button
    /*let downvote = row.insertCell(5);
    let downvoteDiv = document.createElement("div");
    let downvoteNum = document.createElement("p");
    let downvoteButton = document.createElement("button");

    downvoteNum.setAttribute("id", `motion-${item.motionKey}-downvoteCount`);
    downvoteNum.textContent = item.downvoteCount;
    downvoteDiv.style = 'display: flex; gap: 5px; justify-content: center';
    downvoteButton.setAttribute(`id`, `motion-${item.motionKey}-downvote`);
    downvoteButton.setAttribute("class", "downvoteButton");
    downvoteButton.textContent = "downvote";

    downvoteDiv.appendChild(downvoteButton);
    downvoteDiv.appendChild(downvoteNum);
    downvote.appendChild(downvoteDiv);*/
  })
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
      if (event.target == modal) {
          modal.style.display = 'none';
      }
  });
}

document.getElementById("submitMotion").addEventListener("click", async (event)=> {
    const queryParams = new URLSearchParams(window.location.search);
    const currentCommitteeKey = queryParams.get('committeeKey');

    const motionResponse = await fetch(`${server}/api/motion/make`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: document.getElementById("motionName").value,
        desc: document.getElementById("motionDesc").value,
        creator: `${currentUserFName} ${currentUserLname}`,
        committeeKey: currentCommitteeKey,
        creatorKey: currentUserNum
      })
    });

    if (motionResponse.ok) {
      console.log("motion successfully made");

      const returnedKey = await motionResponse.json();
      const newKey = returnedKey.newMotionKey[0].motionKey;

      console.log(newKey);

      // reload page
      window.location.reload();

    }
    else {
      console.log("failed to make motion");
    }
});




//document.getElementById("addMotionButton").addEventListener("click");



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
          { sWidth: '25%' },
          { sWidth: '25%' },
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