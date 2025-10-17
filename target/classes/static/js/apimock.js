var apimock = (function () {
    var mockdata = [];
    mockdata["juan"] = [
        {
            author: "juan",
            name: "plano1",
            points: [{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 30, y: 30 }, { x: 40, y: 40 }, { x: 50, y: 50 }]
        },
        {
            author: "juan",
            name: "plano2",
            points: [{ x: 15, y: 15 }, { x: 25, y: 25 }, { x: 35, y: 35 }, { x: 45, y: 45 }]
        },
        {
            author: "juan",
            name: "plano3",
            points: [{ x: 5, y: 5 }, { x: 10, y: 10 }, { x: 15, y: 15 }, { x: 20, y: 20 }, { x: 25, y: 25 }, { x: 30, y: 30 }]
        }
    ];
    mockdata["ana"] = [
        {
            author: "ana",
            name: "planoA",
            points: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 }]
        },
        {
            author: "ana",
            name: "planoB",
            points: [{ x: 3, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 12, y: 12 }]
        },
        {
            author: "ana",
            name: "planoC",
            points: [{ x: 6, y: 6 }, { x: 7, y: 7 }, { x: 8, y: 8 }, { x: 9, y: 9 }, { x: 10, y: 10 }, { x: 11, y: 11 }, { x: 12, y: 12 }, { x: 13, y: 13 }]
        }
    ];
    mockdata["carlos"] = [
        {
            author: "carlos",
            name: "edificio1",
            points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 0, y: 0 }, { x: 5, y: 5 }, { x: 15, y: 15 }]
        },
        {
            author: "carlos",
            name: "casa_moderna",
            points: [{ x: 20, y: 20 }, { x: 30, y: 20 }, { x: 30, y: 30 }, { x: 25, y: 35 }, { x: 20, y: 30 }, { x: 20, y: 20 }]
        }
    ];
    mockdata["maria"] = [
        {
            author: "maria",
            name: "torre_principal",
            points: [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 20 }, { x: 10, y: 20 }, { x: 10, y: 25 }, { x: 0, y: 25 }, { x: 0, y: 0 }]
        }
    ];
    return {
        getBlueprintsByAuthor: function (author, callback) {
            callback(mockdata[author]);
        },
        getBlueprintsByNameAndAuthor: function (author, name, callback) {
            var blueprint = mockdata[author] ? mockdata[author].find(function (bp) { return bp.name === name; }) : null;
            callback(blueprint);
        },
        getAllBlueprints: function (callback) {
            var allBlueprints = [];
            for (var author in mockdata) {
                if (mockdata.hasOwnProperty(author)) {
                    allBlueprints = allBlueprints.concat(mockdata[author]);
                }
            }
            callback(allBlueprints);
        },
        getAllAuthors: function (callback) {
            var authors = Object.keys(mockdata);
            callback(authors);
        }
    };
})();
