var cy = cytoscape({
  container: document.getElementById('cy'),

  // boxSelectionEnabled: true,
  autounselectify: true,
  zoomingEnabled: true,
  // 最小缩放比例
  minZoom: 0.5,
  // 最大缩放比例
  maxZoom: 1.5,

  style: cytoscape.stylesheet()
    .selector('node').style({
        'content': 'data(id)',
        'width': 20,
        'height': 20,
        'background-color': '#666'
      })
    .selector('edge').style({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'width': 3,
        'line-color': '#666',
        'target-arrow-color': '#666'
      })
    .selector('.highlighted').style({
        'background-color': '#61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }),

  elements: {
    nodes: [
      { data: { 
          id: 'a', 
          commandName: 'kafkasource', 
          jarUrl: null, "rawArg": "{\"groupId\":\"springboot-consumer02\",\"topic\":\"word-count\",\"cluster\":\"192.168.0.104:9092\",\"consumerOffsets\":\"LATEST\",\"encodingConfig\":{\"encodingType\":\"JSON_OBJECT\"}}" 
        } 
      },
      { data: { 
          id: 'b',
          commandName: "kafkasink",
          rawArg: "{\"topic\":\"test_topic\",\"cluster\":\"192.168.0.104:9092\",\"encodingConfig\":{\"encodingType\":\"JSON_OBJECT\"}}"
         } 
      }
    ],

    edges: [
      { data: { id: 'ab', edgeName: "1_2", source: 'a', target: 'b' } }
    ]
      },
});

// 监听node 点击事件
cy.on('tap', function(evt){
  var eventTarget = evt.target;

  if (eventTarget.hasClass("highlighted")) {
    eventTarget.removeClass("highlighted")
  } else {
    eventTarget.addClass("highlighted")
  }
});


// 新建node
$("#create-node").hide();
$("#create-edge").hide();


$('#add-node').click(()=> {$("#create-node").show();$("#create-edge").hide();})
$('#add-edge').click(()=> {$("#create-edge").show();$("#create-node").hide();})

$('#delete').click(()=>{
  cy.remove(cy.elements(".highlighted"))
  $("#create-node").hide();
  $("#create-edge").hide();
})



$('#create-node-yes').click(()=>{
  let ele = { // 一个节点
    group: 'nodes', // 'nodes' for a node, 'edges' for an edge
    data: { // 元素数据
      // id: 'n1', // 每个元素的唯一标识字段id(字符串或数字),在未定义的情况下自动分配.
      id: $('#node-id').val(),
      commandName: $('#command-name').val(),
      jarUrl: $('#jar-url').val(),
      rawArg: $('#raw-arg').val()
    },
    position: {x: 100, y: 100}, // 节点位置
    renderedPosition: {x: 200, y: 200}, // 节点呈现位置,优先级高于position
    selected: false, // 节点被选择
    selectable: true, // 节点可以被选择
    locked: false, // 节点是否被锁定,锁定后,位置不可变
    grabbable: true, // 用户是否可以抓取和移动节点
  };

  cy.add(ele);
  $("#create-node").hide();
})

$('#create-edge-yes').click(()=>{
  let edge =  { // edge e1
    group: 'edges', /* 'nodes' for a node, 'edges' for an edge,指定了'source'和'target'属性,可省略此属性. */
    data: {
      // id: 'e1',
      name: $('#edge-name').val(),
      /* 因为指定了'source'和'target',所以推断为边缘. `eles.move()`可以有效地更改'source'和'target'的内容. */
      source: $('#edge-from').val(), /* 起点 */ 
      target: $('#edge-to').val(),  /* 终点 */
    },
    selected: false, // 关系被选择
    selectable: true
  }
  cy.add(edge);
  $("#create-edge").hide();
})


$('#create-node-no').click(()=>{$("#create-node").hide();})
$('#create-edge-no').click(()=>{$("#create-edge").hide();})


$('#show-fleak-query').click(()=>{
  $("#create-node").hide();
  $("#create-edge").hide();

  var myObject = {
    "nodes": [],
    "topology": []
  }


  var eles = cy.elements()


  eles.forEach( each=> {
    console.log(each.data('id'))

    if (each.isNode()) {
      myObject.nodes.push({
        "nodeId": each.data('id'),
        "node": {
          "commandName": each.data('commandName'),
          "jarUrl": each.data('jarUrl'),
          "rawArg": each.data('rawArg')
        }
      })
    } else {
      myObject.topology.push({
        "edgeName": each.data('edgeName'),
        "from": each.data('source'),
        "to": each.data('target')
      })
    }
  })

  var myString = JSON.stringify(myObject)

  $('#fleak-query').val(myString)

})

