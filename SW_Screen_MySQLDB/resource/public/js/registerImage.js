/**
 * 注册静态图片
 */

function registerNormalImage(url, name, width, height) {
    var image = new Image();
    image.src = url;
    image.onload = function () {
        width = width || image.width;
        height = height || image.height;
        twaver.Util.registerImage(name, image, width, height);
        image.onload = null;
        network.invalidateElementUIs();
    };
}
//注册静态图片
function registerNormalImages() {
    registerNormalImage('../images/true.png', 'icon_true', 25, 25);
    registerNormalImage('../images/false.png', 'icon_false', 25, 25);

    registerNormalImage('../images/机器人.png', 'agv', 80, 80);
    //registerNormalImage('../images/fangkuang.png', 'bg');
    registerNormalImage("../images/obliqueLine.png", "obliqueLine");
}
setTimeout(function () {
    registerNormalImages();

}, 100);

// 注册shape
function registerShapes() {
    twaver.Util.registerShape("line_icon", function (g, shapeData, data, view) {
        var color = shapeData.color || "rgb(125, 206, 255)";
        var gradientColor = shapeData.gradientColor || {
            middleColor: "rgb(159, 250, 255)",
            edgeColor: "rgba(31, 75, 118,0.75)"
        };
        var sign = shapeData.sign || -1;
        var flag = shapeData.flag;

        g.beginPath();
        g.moveTo(-32, -12);
        g.lineTo(32, -12);
        g.closePath();
        g.lineWidth = 1;
        var grd = g.createLinearGradient(-32, 0, 32, 0);
        grd.addColorStop(0, gradientColor.edgeColor);
        grd.addColorStop(0.5, gradientColor.middleColor);
        grd.addColorStop(1, gradientColor.edgeColor);
        g.strokeStyle = grd;
        g.stroke();

        if (flag && flag === true) {
            g.beginPath();
            g.arc(32 * sign, -12, 2.2 * Math.sqrt(2), 0, 2 * Math.PI, false);
            g.arc(32 * sign, -12, 1.5 * Math.sqrt(2), 0, 2 * Math.PI, true);
            g.arc(32 * sign, -12, 0.8 * Math.sqrt(2), 0, 2 * Math.PI, false);
            g.closePath();
            g.fillStyle = "rgb(136, 241, 255)";
            g.fill();
        } else {

            g.beginPath();
            g.moveTo(32 * sign, -12);
            g.lineTo(48 * sign, 0);
            g.closePath();
            var grd2 = g.createLinearGradient(32 * sign, -12, 48 * sign, 0);
            grd2.addColorStop(0, gradientColor.edgeColor);
            grd2.addColorStop(0.9, gradientColor.edgeColor);
            g.strokeStyle = grd2;
            g.stroke();

            g.beginPath();
            g.arc(48 * sign, 0, 2.2 * Math.sqrt(2), 0, 2 * Math.PI, false);
            g.arc(48 * sign, 0, 1.5 * Math.sqrt(2), 0, 2 * Math.PI, true);
            g.arc(48 * sign, 0, 0.8 * Math.sqrt(2), 0, 2 * Math.PI, false);
            g.closePath();
            g.fillStyle = "rgb(136, 241, 255)";
            g.fill();
        }
    });

    twaver.Util.registerShape('line_text_icon', function (g, shapeData, data, view) {
        var text = shapeData.text || "默认文字";
        var font = shapeData.font || "14px Arial";

        g.beginPath();
        g.font = font;
        // 显示不同的 textAlign 值
        g.textAlign = "center";
        g.fillStyle = "rgb(59, 223, 255)";
        g.fillText(text, 0, 0);
        g.closePath();
    });

    twaver.Util.registerShape("unit_text", function (g, shapeData, data, view) {
        var tempArr = shapeData.text.split(" ");
        var text = tempArr[0];
        var unit = tempArr[1];
        var font = shapeData.font || "14px Arial";
        var unitFont = shapeData.unitFont || "10px Arial";

        g.beginPath();
        g.font = font;
        // 显示不同的 textAlign 值
        // g.textAlign = "center";
        g.fillStyle = "rgb(255, 255, 0)";
        g.textBaseline = "bottom";

        if (unit === undefined || unit === "null" || unit === "undefined") {
            g.fillText(text, 0, -15);
            g.closePath();
        } else {
            g.fillText(text, -5, -15);
            g.closePath();

            g.beginPath();
            g.font = unitFont;
            g.textAlign = "left";
            g.textBaseline = "bottom";
            g.fillStyle = "rgb(255, 255, 0)";
            g.fillText(unit, g.measureText(text).width - 5, -16.5);
            g.closePath();
        }
    });

    twaver.Util.registerShape("battery_shape", function (g, shapeData, data, view) {
        var percent = shapeData.percent || 0;
        var unit = shapeData.unit || "%";
        var font = shapeData.font || "12px Arial";
        var unitFont = shapeData.unitFont || "8px Arial";

        var gradientColor, fillColor;

        if (percent >= 0 && percent <= 20) {
            gradientColor = "#F85349";
            fillColor = "#FF8888";
        } else if (percent > 20 && percent <= 60) {
            gradientColor = "rgb(255, 255, 0)";
            fillColor = "rgb(255, 248, 198)";
        } else {
            gradientColor = "rgb(125, 206, 255)";
            fillColor = "rgb(183, 248, 255)";
        }

        g.beginPath();
        g.moveTo(-18, -28);
        g.lineTo(4, -28);
        g.arc(4, -26, 2, Math.PI * 1.5, Math.PI * 2, false);
        g.lineTo(6, -18);
        g.arc(4, -18, 2, 0, Math.PI * 0.5, false);
        g.lineTo(-18, -16);
        g.arc(-18, -18, 2, Math.PI * 0.5, Math.PI * 1, false);
        g.lineTo(-20, -26);
        g.arc(-18, -26, 2, Math.PI * 1, Math.PI * 1.5, false);

        g.moveTo(4, -26.5);
        var x = percent * 24 / 100 - 20;
        g.lineTo(x, -26.5);
        g.lineTo(x, -17.5);
        g.lineTo(4, -17.5);
        g.closePath();

        var grd = g.createLinearGradient(-5, -3, -5, 3);
        grd.addColorStop(0, gradientColor);
        grd.addColorStop(1, fillColor);

        g.fillStyle = grd;
        g.fill();

        g.beginPath();
        g.moveTo(5.8, -26);
        g.lineTo(7.8, -26);
        g.arc(7.8, -25, 1, Math.PI * 1.5, Math.PI * 2, false);
        g.lineTo(8.8, -19);
        g.arc(7.8, -19, 1, 0, Math.PI * 0.5, false);
        g.lineTo(5.8, -18);
        g.closePath();
        g.fill();

        g.beginPath();
        g.font = font;
        // 显示不同的 textAlign 值
        g.textAlign = "left";
        g.textBaseline = "bottom";
        g.font = font;
        g.fillText(percent, 10, -14);
        g.closePath();

        g.beginPath();
        g.font = unitFont;
        g.textAlign = "left";
        g.textBaseline = "bottom";
        g.fillText(unit, g.measureText(percent).width + 15, -15);
        g.closePath();
    });

    twaver.Util.registerShape("deviceState", function (g, shapeData, data, view) {
        var state = shapeData.state || "working";
        var color;
        switch (state) {
            case "working":
                color = "rgb(99, 202, 80)";
                break;
            case "pause":
                color = "rgb(255, 255, 0)";
                break;
            case "trouble":
                color = "rgb(246, 83, 73)";
                break;
        }

        g.beginPath();
        g.lineWidth = 1;
        g.arc(0, -12, 8, 0, Math.PI * 2, true);
        g.closePath();
        g.strokeStyle = color;
        g.stroke();

        g.beginPath();
        g.lineWidth = 4;
        g.arc(0, -12, 5.6, Math.PI * 0.05, Math.PI * 1.95, true);
        g.closePath();
        g.strokeStyle = color;
        g.stroke();

        g.beginPath();
        g.arc(0, -12, 3.9, 0, Math.PI * 2, true);
        g.closePath();
        g.fillStyle = color;
        g.fill();
    });

    twaver.Util.registerShape("certification", function (g, shapeData, data, view) {
        var flag = shapeData.flag;
        var text = shapeData.text;
        var state = shapeData.state;
        var unit = shapeData.unit;
        var gradientColor = shapeData.gradientColor || {
            middleColor: "rgb(159, 250, 255)",
            edgeColor: "rgb(31, 75, 118,0.75)"
        };
        var topColor = "rgb(255, 255, 0)";
        var bottomColor = "rgb(59, 223, 255)";

        // 绘制斜线
        if (flag) {
            // 用canvas绘制实现
            // g.beginPath();
            // g.moveTo(-32, 0);
            // g.lineTo(-26, -24);
            // g.closePath();

            // g.lineWidth = 1;
            // var grd = g.createLinearGradient(-48, 0, -42, -24);
            // grd.addColorStop(0, gradientColor.edgeColor);
            // grd.addColorStop(0.5, gradientColor.middleColor);
            // grd.addColorStop(1, gradientColor.edgeColor);
            // g.strokeStyle = grd;
            // g.stroke();

            // 用注册图片实现
            g.drawShape({
                shape: "image",
                name: "obliqueLine",
                x: -33,
                y: -22,
            })
        }

        // 绘制上部的文字
        // 上面为图片
        if (text === "设备状态") {
            g.drawShape({
                shape: "deviceState",
                state: state
            });
        }
        // 上面没有单位
        if (!unit && text !== "设备状态") {
            g.drawShape({
                shape: "text",
                text: state,
                x: 0,
                y: -2,
                textBaseline: "bottom",
                textAlign: "center",
                font: "16px Arial",
                fill: topColor
            })
        }
        // 有单位
        if (unit) {
            g.drawShape({
                shape: "text",
                text: state,
                x: -24,
                y: -2,
                textBaseline: "bottom",
                textAlign: "left",
                font: "16px Arial",
                fill: topColor
            });
            g.drawShape({
                shape: "text",
                text: unit,
                x: -2,
                y: -3,
                textBaseline: "bottom",
                textAlign: "left",
                font: "10px Arial",
                fill: topColor
            });
        }



        // 绘制下部的文字
        g.drawShape({
            shape: "text",
            text: text,
            x: 0,
            y: 14,
            textBaseline: "bottom",
            textAlign: "center",
            font: "10px Arial",
            fill: bottomColor
        })
    });
}
registerShapes();


twaver.Util.registerImage('factoryBg', {
    "w": 1000,
    "h": 1000,
    origin: {
        x: 0,
        y: 0
    },
    getPath: function (data) {
        console.log(data);
        var path = data.getClient('path');
        return path;
    },
    "v": [{
        shape: "draw",
        draw: function (g, data, view) {
            var path = this.getPath(data);
            console.log(path)
            g.moveTo(0, 0),
            g.lineTo(0, 100);
            g.lineTo(100, 100);
            g.lineTo(100, 0);
            g.lineTo(0, 0);
            g.fillStyle = 'red';
            g.fill();
        }
    }]
})




for (let i = 0; i < 4; i++) {
    twaver.Util.registerImage("customIcon-" + i, {
        "w": 128,
        "h": 64,
        "scale": 1,
        origin: {
            x: 0.5,
            y: 0.5
        },
        cache: true,
        _getSign: function () {
            var index = i;
            var sign;
            switch (index) {
                case 0:
                case 2:
                    sign = 1;
                    break;
                case 1:
                case 3:
                    sign = -1;
                    break;
                default:
                    sign = 1;
                    break;
            }
            return sign;
        },
        "v": [{
                shape: "draw",
                draw: function (g, node, view) {
                    var data = node.getClient("icon_data");
                    var referencesDatas = node.getClient("referencesDatas");
                    var currentIcon = referencesDatas["index"][i];

                    if (currentIcon) {
                        var sign = this._getSign(referencesDatas);
                        var referencesData = referencesDatas[currentIcon];

                        var datatype = referencesData["datatype"];
                        var name = referencesData.name;
                        var unit = referencesData.unit;
                        var text = data[currentIcon] || "空";
                        var unitedText = text + ' ' + unit;

                        g.drawShape({
                            shape: "line_text_icon",
                            text: name,
                            font: "12px Arial"
                        });

                        g.drawShape({
                            shape: "line_icon",
                            sign: sign
                        });


                        if (datatype === "Boolean") {
                            var str = data[referencesData["id"]] ? "true" : "false";
                            g.drawShape({
                                shape: 'image',
                                name: "icon_" + str,
                                w: 16,
                                h: 16,
                                y: -32,
                                x: -12
                            });
                        } else {
                            g.drawShape({
                                shape: 'unit_text',
                                text: unitedText,
                            });
                        }
                    }
                }
            },

        ]
    });

    twaver.Util.registerImage("device-" + i, {
        "w": 128,
        "h": 64,
        "scale": 0.7,
        origin: {
            x: 0.5,
            y: 0.5
        },
        cache: true,
        _getSign: function () {
            var index = i;
            var sign;
            switch (index) {
                case 0:
                case 2:
                    sign = 1;
                    break;
                case 1:
                case 3:
                    sign = -1;
                    break;
                default:
                    sign = 1;
                    break;
            }
            return sign;
        },
        "v": [{
            shape: "draw",
            draw: function (g, node, view) {
                var data = node.getClient("icon_data");
                var referencesDatas = node.getClient("referencesDatas");
                var currentIcon = referencesDatas["index"][i];

                if (currentIcon) {
                    var sign = this._getSign();

                    var referencesData = referencesDatas[currentIcon];
                    var flag = referencesDatas["index"].indexOf(currentIcon) >= 1 ? true : false;

                    var name = referencesData.name;
                    var state = data[currentIcon];
                    var unit = referencesData.unit;

                    g.drawShape({
                        shape: "certification",
                        flag: flag,
                        text: name,
                        state: state || "空",
                        unit: unit,
                    });

                }
            }
        }, ]
    });
}



// 墙体
function wallPathImage() {

    twaver.Util.registerImage('door', {
        w: 80,
        h: 80,
        scale: 1,
        origin: {
            x: 0,
            y: 0
        },
        getRotate: function (data) {
            return data.getClient("rotate");
        },
        rotate: '<%= this.getRotate(data) %>',
        rotateOrigin: {
            x: 40,
            y: 40
        },
        v: [{
                shape: 'path',
                data: [{
                        x: 0,
                        y: 0
                    },
                    {
                        x: 0,
                        y: 42
                    },
                    {
                        x: 80,
                        y: 42
                    },
                    {
                        x: 80,
                        y: 0
                    }
                ],
                lineColor: topoStyle.door.color,
                lineWidth: 2.5,
            },
            {
                shape: 'draw',
                draw: function (g, node, view) {
                    g.sector(80, 41, 41, 180 * Math.PI / 180, 270 * Math.PI / 180);
                    g.fillStyle = topoStyle.door.color;
                    g.fill();
                },
            },
            {

                shape: 'draw',
                draw: function (g, node, view) {
                    g.sector(0, 41, 41, -90 * Math.PI / 180, 0 * Math.PI / 180);
                    g.fillStyle = topoStyle.door.color;
                    g.fill();
                },
            }
        ]
    })

    twaver.Util.registerImage('pillar', {
        w: 16,
        h: 16,
        clip: true,
        origin: {
            x: 0,
            y: 0
        },
        clip: true,
        v: [{
            shape: 'path',
            data: [{
                    x: 0,
                    y: 0
                },
                {
                    x: 0,
                    y: 16
                },
                {
                    x: 16,
                    y: 16
                },
                {
                    x: 16,
                    y: 0
                }
            ],
            "fill": topoStyle.pillar.color,
        }]
    });
}



twaver.Util.registerImage("window", {
    w: 100,
    h: 36,
    clip: true,
    v: [{
        shape: "draw",
        draw: function (g, node, view) {
            var windowDatas = node.getClient("windowDatas");

            var offset = (windowDatas && windowDatas.offset) || 12 / 1.3;
            var lineWidth = (windowDatas && windowDatas.lineWidth) || 90;
            var lineHeight = (windowDatas && windowDatas.lineHeight) || 2;
            var color1 = topoStyle.window.color;
            var color2 = topoStyle.window.color;

            g.beginPath();
            g.lineWidth = lineHeight;
            g.moveTo(-lineWidth / 2, offset / 2);
            g.lineTo(lineWidth / 2, offset / 2);
            g.moveTo(-lineWidth / 2, -offset / 2);
            g.lineTo(lineWidth / 2, -offset / 2);
            g.moveTo(-lineWidth / 2, -offset / 2 * 3);
            g.lineTo(lineWidth / 2, -offset / 2 * 3);
            g.moveTo(-lineWidth / 2, offset / 2 * 3);
            g.lineTo(lineWidth / 2, offset / 2 * 3);
            g.closePath();
            g.strokeStyle = color1;
            g.stroke();

            g.beginPath();
            g.lineWidth = lineHeight * 2;
            g.moveTo(-lineWidth / 2, -offset / 2 * 3 - lineHeight / 2);
            g.lineTo(-lineWidth / 2, offset / 2 * 3 + lineHeight / 2);
            g.moveTo(lineWidth / 2, -offset / 2 * 3 - lineHeight / 2);
            g.lineTo(lineWidth / 2, offset / 2 * 3 + lineHeight / 2);
            g.closePath();
            g.strokeStyle = color2;
            g.stroke();

        }
    }]
})


twaver.Util.registerImage('point', {
    w: 40,
    h: 40,
    origin: {
        x: 0.5,
        y: 0.5
    },
    fill: topoStyle.point.color,
    v: [{
        shape: 'circle',
        cx: 0,
        cy: 0,
        r: topoStyle.point.r,
        line: {
            width: topoStyle.point.width,
            color: topoStyle.point.outColor
        }
    }]
})