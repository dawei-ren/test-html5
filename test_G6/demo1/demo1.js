const data = {
// 点集
  nodes: [
    {
      id: '1', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      label: 'kafkasource',
      rawArg:"{\"groupId\":\"springboot-consumer02\",\"topic\":\"word-count\",\"cluster\":\"192.168.0.104:9092\",\"consumerOffsets\":\"LATEST\",\"encodingConfig\":{\"encodingType\":\"JSON_OBJECT\"}}"
    },
    {
      id: '2', // String，该节点存在则必须，节点的唯一标识
      x: 300, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      label: 'kafkasink',
      rawArg: "{\"topic\":\"test_topic\",\"cluster\":\"192.168.0.104:9092\",\"encodingConfig\":{\"encodingType\":\"JSON_OBJECT\"}}"
    },
  ],
  // 边集
  edges: [
    {
      source: '1', // String，必须，起始点 id
      target: '2', // String，必须，目标点 id
      label: '1_2',
      style: {
        endArrow: true,
        endArrow: {
          path: G6.Arrow.vee(10, 20, 25),
          d: 25
        }
      }
    },
  ],
};


const graph = new G6.Graph({
  container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
  width: 800, // Number，必须，图的宽度
  height: 500, // Number，必须，图的高度

  modes: {
    // 默认交互模式
    default: ['drag-node', 'click-select',],
    // 增加边交互模式
    addEdge: ['click-add-edge', 'click-select']
  },
  // 节点在不同状态下的样式集合
  nodeStateStyles: {
    // 节点在 selected 状态下的样式，对应内置的 click-select 行为
    selected: {
      stroke: '#666',
      lineWidth: 2,
      fill: 'steelblue'
    }
  }
});

graph.data(data); // 读取 Step 2 中的数据源到图上
graph.render(); // 渲染图

  
// 新建node
$("#create-node-input").hide();


$('#create-node').click(() => {
  if (graph.getCurrentMode()=='addEdge') {
    graph.setMode("default");
    $("#create-edge").attr("class","btn-unselect")
  }
  $("#create-node-input").show();

})

$('#delete-node').click(() => {
  graph.findAllByState('node', 'selected').forEach(each => {
    // console.log(each);
    graph.removeItem(each, true);
  });
  graph.findAllByState('edge', 'selected').forEach(each => {
    // console.log(each);
    graph.removeItem(each, true)
  })
})




$('#create-edge').click(() => {
  $("#create-node-input").hide();


  if (graph.getCurrentMode()=='addEdge') {
    graph.setMode("default");
    $("#create-edge").attr("class","btn-unselect")
  } else {
    
    graph.setMode("addEdge");
    $("#create-edge").attr("class","btn-select")
  }
})



let addedNodeCount = 0;

$('#create-node-yes').click(() => {
  // 在图上新增一个节点
  graph.addItem('node', {
    x: 200,
    y: 100,
    id: `node-${addedNodeCount}`, // 生成唯一的 id
    label: $('#command-name').val(),
    rawArg: $('#raw-arg').val()
  });
  addedNodeCount++;
  $("#create-node-input").hide();
})






$('#to-json').click(() => {
  $("#create-node-input").hide();

  let myObject = {"nodes": [],"topology": []}
  graph.getNodes().forEach(each => {
    myObject.nodes.push({
      "nodeId": each.get("model")["id"],
      "node": {
        "commandName": each.get("model")["label"],
        "jarUrl": null,
        "rawArg": each.get("model")["rawArg"]
      }
    })
  })

  graph.getEdges().forEach(each=>{
    myObject.topology.push({
      "edgeName": each.get("model")['label'],
      "from": each.get("model")['source'],
      "to": each.get("model")['target']
    })
  })

  $('#fleak-query').val(JSON.stringify(myObject))
})


// 封装点击添加边的交互
G6.registerBehavior('click-add-edge', {
  
  // 设定该自定义行为需要监听的事件及其响应函数
  getEvents() {
    return {
      'node:click': 'onClick', // 监听事件 node:click，响应函数是 onClick
      mousemove: 'onMousemove', // 监听事件 mousemove，响应函数是 onMousemove
      'edge:click': 'onEdgeClick', // 监听事件 edge:click，响应函数是 onEdgeClick
    };
  },
  // getEvents 中定义的 'node:click' 的响应函数
  onClick(ev) {
    const node = ev.item;
    const graph = this.graph;
    // 鼠标当前点击的节点的位置
    const point = { x: ev.x, y: ev.y };
    const model = node.getModel();
    if (this.addingEdge && this.edge) {
      graph.updateItem(this.edge, {
        target: model.id,
      });

      this.edge = null;
      this.addingEdge = false;
    } else {
      // 在图上新增一条边，结束点是鼠标当前点击的节点的位置
      this.edge = graph.addItem('edge', {
        source: model.id,
        target: point,
        name: 'edge',
        style: {
          endArrow: true,
          endArrow: {
            path: G6.Arrow.vee(10, 20, 25),
            d: 25
          }
        }
      });
      this.addingEdge = true;
    }
  },
  // getEvents 中定义的 mousemove 的响应函数
  onMousemove(ev) {
    // 鼠标的当前位置
    const point = { x: ev.x, y: ev.y };
    if (this.addingEdge && this.edge) {
      // 更新边的结束点位置为当前鼠标位置
      this.graph.updateItem(this.edge, {
        target: point,
      });
    }
  },
  // getEvents 中定义的 'edge:click' 的响应函数
  onEdgeClick(ev) {
    const currentEdge = ev.item;
    // 拖拽过程中，点击会点击到新增的边上
    if (this.addingEdge && this.edge == currentEdge) {
      graph.removeItem(this.edge);
      this.edge = null;
      this.addingEdge = false;
    }
  },
});

G6.registerEdge('custom-edge',{
    // 响应状态变化
    setState(name, value, item) {
      const group = item.getContainer();
      const shape = group.get('children')[0]; // 顺序根据 draw 时确定
      if (name === 'active') {
        if (value) {
          shape.attr('stroke', 'red');
        } else {
          shape.attr('stroke', '#333');
        }
      }
      if (name === 'selected') {
        if (value) {
          shape.attr('lineWidth', 3);
        } else {
          shape.attr('lineWidth', 2);
        }
      }
    },
  },
  'line',
);


// 点击时选中，再点击时取消
graph.on('edge:click', (ev) => {
  const edge = ev.item;
  graph.setItemState(edge, 'selected', !edge.hasState('selected')); // 切换选中
});

graph.on('edge:mouseenter', (ev) => {
  const edge = ev.item;
  graph.setItemState(edge, 'active', true);
});

graph.on('edge:mouseleave', (ev) => {
  const edge = ev.item;
  graph.setItemState(edge, 'active', false);
});
  