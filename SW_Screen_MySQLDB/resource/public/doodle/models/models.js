var models = [{
    title: '2D区域模型',
    contents: [{
            id: 'wall',
            description: '外墙',
            imageName: 'wall.png',
            type: 'wall',
            id2d: 'twaver.idc.wall.top'
        },
        {
            id: 'innerwall',
            description: '内墙',
            imageName: 'innerWall.png',
            type: 'innerWall',
            id2d: 'twaver.idc.innerWall.top'
        },
        {
            id: 'door',
            description: '门',
            imageName: 'door.png',
            type: 'door'
        },
        {
            id: 'pillar',
            description: '柱子',
            imageName: 'pillar.png',
            type: 'pillar'
        }, 
        {
            id: 'channel',
            description: '通道',
            imageName: 'tongdao.png',
            type: 'channel',
            id2d: 'twaver.idc.innerWall.top'
        },
        {
            id: 'window',
            description: '窗户',
            imageName: 'window.png',
            type: 'window'
        },
    ]
}, {
    title: '2D模型',
    contents: [{
        id: 'certification',
        description: '制证设备',
        imageName: '制证设备.png',
        type: 'certification',
    }, {
        id: 'quality',
        description: '质检设备',
        imageName: '质检设备.png',
        type: 'quality',
    }, {
        id: 'charge',
        description: '充电桩',
        imageName: '充电桩.png',
        type: 'charge'
    }]
}]