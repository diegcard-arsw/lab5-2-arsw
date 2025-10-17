var apimock = (function () {
    var mockdata = [];
    mockdata["juan"] = [
        {
            author: "juan",
            name: "plano1",
            points: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }]
        },
        {
            author: "juan",
            name: "plano2",
            points: [{ x: 15, y: 15 }, { x: 25, y: 25 }]
        },
        {
            author: "juan",
            name: "plano3",
            points: [{ x: 5, y: 5 }, { x: 10, y: 10 }, { x: 15, y: 15 }, { x: 20, y: 20 }]
        }
    ];
    mockdata["ana"] = [
        {
            author: "ana",
            name: "planoA",
            points: [{ x: 1, y: 1 }, { x: 2, y: 2 }]
        },
        {
            author: "ana",
            name: "planoB",
            points: [{ x: 3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 5 }]
        },
        {
            author: "ana",
            name: "planoC",
            points: [{ x: 6, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 9 }, { x: 10, y: 10 }]
        }
    ];
    return {
        getBlueprintsByAuthor: function (author, callback) {
            callback(mockdata[author]);
        },
        getBlueprintsByNameAndAuthor: function (author, name, callback) {
            var blueprint = mockdata[author].find(function (bp) { return bp.name === name; });
            callback(blueprint);
        }
    };
})();
