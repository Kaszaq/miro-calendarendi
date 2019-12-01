const DAY_BOX_HEIGHT = 100;
const DAY_BOX_WIDTH = 100;
const MONTH_BOX_HEIGHT = 100;
const DAY_NAME_HEIGHT = 50;
const MONTH_BOX_WIDTH = 7 * DAY_BOX_WIDTH;
const METADATA_DATE_FORMAT = "YYYY-MM-DD";
const SINGLE_BAR_COLORS = ["#8fd14f", "#4eaa40"];
const DEFAULT_PREVIOUS_STYLE = {
    backgroundColor: "#e6e6e6",
    backgroundOpacity: 1,
    bold: 0,
    borderColor: "#808080",
    borderOpacity: 1,
    borderStyle: 2,
    borderWidth: 1,
    fontFamily: 10,
    fontSize: 18,
    highlighting: "",
    italic: 0,
    shapeType: 3,
    strike: 0,
    textAlign: "r",
    textAlignVertical: "t",
    textColor: "#1a1a1a",
    underline: 0
};
const DEFAULT_ACTIVE_STYLE = {
    backgroundColor: "#e6e6e6",
    backgroundOpacity: 1,
    bold: 0,
    borderColor: "#f24726",
    borderOpacity: 1,
    borderStyle: 2,
    borderWidth: 3,
    fontFamily: 10,
    fontSize: 18,
    highlighting: "",
    italic: 0,
    shapeType: 3,
    strike: 0,
    textAlign: "r",
    textAlignVertical: "t",
    textColor: "#1a1a1a",
    underline: 0
}
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // I know I can get this from moment / format / 'ddd'
function getSingleTopBarColor(number) {
    return SINGLE_BAR_COLORS[number % 2];
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function drawIt(initialPosX, initialPosY, pData, calendarId) {
    pData = pData || moment();

    // this is drawing one month
    let widgetsToCreate = []
    let minDate = pData.clone().startOf('month').startOf('isoWeek');
    ;
    let maxDate = pData.clone().endOf('month').endOf('isoWeek');
    let monthNumber = pData.month();
    widgetsToCreate.push({
        type: 'shape',
        text: "<p>" + pData.format('MMMM YYYY') + "</p>",
        x: initialPosX + MONTH_BOX_WIDTH / 2,
        y: initialPosY + MONTH_BOX_HEIGHT / 2,
        width: MONTH_BOX_WIDTH,
        height: MONTH_BOX_HEIGHT,
        style: {
            backgroundColor: "#8fd14f",
            backgroundOpacity: 1,
            bold: 0,
            borderColor: "#808080",
            borderOpacity: 1,
            borderStyle: 2,
            borderWidth: 1,
            fontFamily: 0,
            fontSize: 24,
            highlighting: 0,
            italic: 0,
            shapeType: 3,
            strike: 0,
            textAlign: "c",
            textAlignVertical: "m",
            textColor: "#000000",
            underline: 0,
        }
    });

    for (let i = 0; i < 7; i++) {
        widgetsToCreate.push({
            type: 'shape',
            text: DAY_NAMES[i],
            x: initialPosX + DAY_BOX_WIDTH / 2 + DAY_BOX_WIDTH * i,
            y: initialPosY + MONTH_BOX_HEIGHT + DAY_NAME_HEIGHT / 2,
            width: DAY_BOX_WIDTH,
            height: DAY_NAME_HEIGHT,
            style: {
                backgroundColor: "#cee741",
                backgroundOpacity: 1,
                bold: 0,
                borderColor: "#808080",
                borderOpacity: 1,
                borderStyle: 2,
                borderWidth: 1,
                fontFamily: 10,
                fontSize: 24,
                highlighting: 0,
                italic: 0,
                shapeType: 3,
                strike: 0,
                textAlign: "c",
                textAlignVertical: "t",
                textColor: "#1a1a1a",
                underline: 0,
            }
        });
    }
    let tempMoment = minDate.clone();
    let days = 0;
    let todayFormattedText = moment().format(METADATA_DATE_FORMAT);
    while (tempMoment.isSameOrBefore(maxDate)) {
        let style;
        let metadata;
        let active = false;
        let dayFormattedText = tempMoment.format(METADATA_DATE_FORMAT);

        if (monthNumber === tempMoment.month()) {
            active = dayFormattedText === todayFormattedText;
            metadata = {
                [CLIENT_ID]: {
                    calendarId: calendarId,
                    date: dayFormattedText,
                    active: active

                }
            };
            if (active) {

                style = DEFAULT_ACTIVE_STYLE;
            } else {

                style = DEFAULT_PREVIOUS_STYLE
            }
        } else {
            style = {
                backgroundColor: "#fbfbfb",
                backgroundOpacity: 1,
                bold: 0,
                borderColor: "#808080",
                borderOpacity: 1,
                borderStyle: 2,
                borderWidth: 1,
                fontFamily: 10,
                fontSize: 18,
                highlighting: "",
                italic: 0,
                shapeType: 3,
                strike: 0,
                textAlign: "r",
                textAlignVertical: "t",
                textColor: "#a4a4a4",
                underline: 0
            }
        }
        widgetsToCreate.push({
            type: 'shape',
            text: "" + tempMoment.date(),
            x: initialPosX + DAY_BOX_WIDTH / 2 + DAY_BOX_WIDTH * (tempMoment.isoWeekday() - 1),
            y: initialPosY + MONTH_BOX_HEIGHT + DAY_NAME_HEIGHT + DAY_BOX_HEIGHT / 2 + Math.floor(days / 7) * DAY_BOX_HEIGHT,
            width: DAY_BOX_WIDTH,
            height: DAY_BOX_HEIGHT,
            style: style,
            metadata: metadata
        });
        days++;
        tempMoment.add(1, 'days');
    }
    createWidgets(widgetsToCreate);
}


async function changeWidgets(pMoment, calendarId, previousCount, activeStyle, previousStyle) {
    //set previous styles
    let diff = previousCount > 0 ? 1 : -1;
    let i = 0;
    let widgetsToUpdate = [];
    // previous
    while (i !== previousCount) {
        (await miro.board.widgets.get({
            metadata: {
                [CLIENT_ID]: {
                    calendarId: calendarId,
                    date: pMoment.clone().subtract(i + diff, 'days').format(METADATA_DATE_FORMAT)
                }
            }
        })).forEach(w => {
            w.style = previousStyle;
            w.metadata[CLIENT_ID].active = false;
            widgetsToUpdate.push(w);
        });
        i += diff;
    }
    // new actives
    (await miro.board.widgets.get({
        metadata: {
            [CLIENT_ID]: {
                calendarId: calendarId,
                date: pMoment.format(METADATA_DATE_FORMAT)
            }
        }
    })).forEach(w => {
        if (!w.metadata[CLIENT_ID].active) {

            w.style = activeStyle;
            w.metadata[CLIENT_ID].active = true;
            widgetsToUpdate.push(w);
        }
    });
    if (widgetsToUpdate.length === 0) {
        return [];
    } else {
        return updateWidgets(widgetsToUpdate);
    }
}


async function moveToDate(pMoment, calendarId) {
    let activeWidgets = (await miro.board.widgets.get({
        metadata: {
            [CLIENT_ID]: {
                calendarId: calendarId,
                active: true
            }
        }
    }));
    // todo: find earliest actually to avoid any bugs, or latest... or maybe run this for each active separately?... omg


    let activeStyle;
    let previousStyle;
    let previousCount;
    if (activeWidgets.length === 0) {
        activeStyle = DEFAULT_ACTIVE_STYLE;
        previousStyle = DEFAULT_PREVIOUS_STYLE;// TODO: would be best to refactor this to try find closes widget style to current Date and this apply as "previous one", instead of going to default
        previousCount = 0;
    } else {
        let selectedActiveWidget = activeWidgets[0];
        activeStyle = selectedActiveWidget.style;
        let activeWidgetMoment = moment(selectedActiveWidget.metadata[CLIENT_ID].date);
        let previousIsPrevious = activeWidgetMoment.isSameOrBefore(pMoment);
        let diff = previousIsPrevious ? 1 : -1;
        let mathOp = previousIsPrevious ? Math.ceil : Math.floor
        let previousToActiveWidgets = (await miro.board.widgets.get({ // TODO: would be best to refactor this to try find previous widget by finding next one closest, not checking only 1 day diff as it might have been deleted yet some other days might have been not.
            metadata: {
                [CLIENT_ID]: {
                    calendarId: calendarId,
                    date: activeWidgetMoment.clone().subtract(diff, 'days').format(METADATA_DATE_FORMAT)
                }
            }
        }));
        previousCount = mathOp(pMoment.diff(activeWidgetMoment, 'days', true));
        if (previousToActiveWidgets.length === 0) {
            previousStyle = DEFAULT_PREVIOUS_STYLE;
        } else {
            previousStyle = previousToActiveWidgets[0].style;
        }
    }
    return changeWidgets(pMoment, calendarId, previousCount, activeStyle, previousStyle);
}

async function activateDay(moment) {
    let allWidgetsMadeByPlugin = (await miro.board.widgets.get('metadata.' + CLIENT_ID));

    let calendarIds = allWidgetsMadeByPlugin.map(w => {
        return w.metadata[CLIENT_ID].calendarId
    });
    let uniqueCalendarIds = new Set(calendarIds);
    for (let calendarId of uniqueCalendarIds) {
        moveToDate(moment,
            calendarId
        )
    }
}

let authorizer = new Authorizer(["boards:write", "boards:read"]);
miro.onReady(async () => {
    if (!await authorizer.isAuthorized()) {
        authorizer.registerPostAuthFunction(() => {
            activateDay(moment());
        });
    } else {
        activateDay(moment());
    }
    miro.initialize({
        extensionPoints: {
            toolbar: {
                title: 'Import charts',
                toolbarSvgIcon: '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 4V20H20V4H4ZM3 2C2.44772 2 2 2.44772 2 3V21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21V3C22 2.44772 21.5523 2 21 2H3Z" fill="currentColor"/>\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 5.8V20.2H20V5.8H4ZM3 4C2.44772 4 2 4.40294 2 4.9V21.1C2 21.5971 2.44772 22 3 22H21C21.5523 22 22 21.5971 22 21.1V4.9C22 4.40294 21.5523 4 21 4H3Z" fill="currentColor"/>\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 5.8V20.2H20V5.8H4ZM3 4C2.44772 4 2 4.40294 2 4.9V21.1C2 21.5971 2.44772 22 3 22H21C21.5523 22 22 21.5971 22 21.1V4.9C22 4.40294 21.5523 4 21 4H3Z" fill="currentColor"/>\n' +
                    '<path d="M17.25 16H18.75C18.8881 16 19 16.1119 19 16.25V17.75C19 17.8881 18.8881 18 18.75 18H17.25C17.1119 18 17 17.8881 17 17.75V16.25C17 16.1119 17.1119 16 17.25 16Z" fill="currentColor"/>\n' +
                    '<path d="M5.25 16H6.75C6.88807 16 7 16.1119 7 16.25V17.75C7 17.8881 6.88807 18 6.75 18H5.25C5.11193 18 5 17.8881 5 17.75V16.25C5 16.1119 5.11193 16 5.25 16Z" fill="currentColor"/>\n' +
                    '<path d="M9.25 16H10.75C10.8881 16 11 16.1119 11 16.25V17.75C11 17.8881 10.8881 18 10.75 18H9.25C9.11193 18 9 17.8881 9 17.75V16.25C9 16.1119 9.11193 16 9.25 16Z" fill="currentColor"/>\n' +
                    '<path d="M13.25 16H14.75C14.8881 16 15 16.1119 15 16.25V17.75C15 17.8881 14.8881 18 14.75 18H13.25C13.1119 18 13 17.8881 13 17.75V16.25C13 16.1119 13.1119 16 13.25 16Z" fill="currentColor"/>\n' +
                    '<path d="M17.25 8H18.75C18.8881 8 19 8.11193 19 8.25V9.75C19 9.88807 18.8881 10 18.75 10H17.25C17.1119 10 17 9.88807 17 9.75V8.25C17 8.11193 17.1119 8 17.25 8Z" fill="currentColor"/>\n' +
                    '<path d="M5.25 8H6.75C6.88807 8 7 8.11193 7 8.25V9.75C7 9.88807 6.88807 10 6.75 10H5.25C5.11193 10 5 9.88807 5 9.75V8.25C5 8.11193 5.11193 8 5.25 8Z" fill="currentColor"/>\n' +
                    '<path d="M9.25 8H10.75C10.8881 8 11 8.11193 11 8.25V9.75C11 9.88807 10.8881 10 10.75 10H9.25C9.11193 10 9 9.88807 9 9.75V8.25C9 8.11193 9.11193 8 9.25 8Z" fill="currentColor"/>\n' +
                    '<path d="M13.25 8H14.75C14.8881 8 15 8.11193 15 8.25V9.75C15 9.88807 14.8881 10 14.75 10H13.25C13.1119 10 13 9.88807 13 9.75V8.25C13 8.11193 13.1119 8 13.25 8Z" fill="currentColor"/>\n' +
                    '<path d="M17.25 12H18.75C18.8881 12 19 12.1119 19 12.25V13.75C19 13.8881 18.8881 14 18.75 14H17.25C17.1119 14 17 13.8881 17 13.75V12.25C17 12.1119 17.1119 12 17.25 12Z" fill="currentColor"/>\n' +
                    '<path d="M5.25 12H6.75C6.88807 12 7 12.1119 7 12.25V13.75C7 13.8881 6.88807 14 6.75 14H5.25C5.11193 14 5 13.8881 5 13.75V12.25C5 12.1119 5.11193 12 5.25 12Z" fill="currentColor"/>\n' +
                    '<path d="M9.25 12H10.75C10.8881 12 11 12.1119 11 12.25V13.75C11 13.8881 10.8881 14 10.75 14H9.25C9.11193 14 9 13.8881 9 13.75V12.25C9 12.1119 9.11193 12 9.25 12Z" fill="currentColor"/>\n' +
                    '<path d="M13.25 12H14.75C14.8881 12 15 12.1119 15 12.25V13.75C15 13.8881 14.8881 14 14.75 14H13.25C13.1119 14 13 13.8881 13 13.75V12.25C13 12.1119 13.1119 12 13.25 12Z" fill="currentColor"/>',
                librarySvgIcon:
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 8V40H40V8H8ZM6 4C4.89543 4 4 4.89543 4 6V42C4 43.1046 4.89543 44 6 44H42C43.1046 44 44 43.1046 44 42V6C44 4.89543 43.1046 4 42 4H6Z" fill="#050038"/>\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 11.6V40.4H40V11.6H8ZM6 8C4.89543 8 4 8.80589 4 9.8V42.2C4 43.1941 4.89543 44 6 44H42C43.1046 44 44 43.1941 44 42.2V9.8C44 8.80589 43.1046 8 42 8H6Z" fill="#050038"/>\n' +
                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 11.6V40.4H40V11.6H8ZM6 8C4.89543 8 4 8.80589 4 9.8V42.2C4 43.1941 4.89543 44 6 44H42C43.1046 44 44 43.1941 44 42.2V9.8C44 8.80589 43.1046 8 42 8H6Z" fill="#050038"/>\n' +
                    '<path d="M34.5 32H37.5C37.7761 32 38 32.2239 38 32.5V35.5C38 35.7761 37.7761 36 37.5 36H34.5C34.2239 36 34 35.7761 34 35.5V32.5C34 32.2239 34.2239 32 34.5 32Z" fill="#050038"/>\n' +
                    '<path d="M10.5 32H13.5C13.7761 32 14 32.2239 14 32.5V35.5C14 35.7761 13.7761 36 13.5 36H10.5C10.2239 36 10 35.7761 10 35.5V32.5C10 32.2239 10.2239 32 10.5 32Z" fill="#050038"/>\n' +
                    '<path d="M18.5 32H21.5C21.7761 32 22 32.2239 22 32.5V35.5C22 35.7761 21.7761 36 21.5 36H18.5C18.2239 36 18 35.7761 18 35.5V32.5C18 32.2239 18.2239 32 18.5 32Z" fill="#050038"/>\n' +
                    '<path d="M26.5 32H29.5C29.7761 32 30 32.2239 30 32.5V35.5C30 35.7761 29.7761 36 29.5 36H26.5C26.2239 36 26 35.7761 26 35.5V32.5C26 32.2239 26.2239 32 26.5 32Z" fill="#050038"/>\n' +
                    '<path d="M34.5 16H37.5C37.7761 16 38 16.2239 38 16.5V19.5C38 19.7761 37.7761 20 37.5 20H34.5C34.2239 20 34 19.7761 34 19.5V16.5C34 16.2239 34.2239 16 34.5 16Z" fill="#050038"/>\n' +
                    '<path d="M10.5 16H13.5C13.7761 16 14 16.2239 14 16.5V19.5C14 19.7761 13.7761 20 13.5 20H10.5C10.2239 20 10 19.7761 10 19.5V16.5C10 16.2239 10.2239 16 10.5 16Z" fill="#050038"/>\n' +
                    '<path d="M18.5 16H21.5C21.7761 16 22 16.2239 22 16.5V19.5C22 19.7761 21.7761 20 21.5 20H18.5C18.2239 20 18 19.7761 18 19.5V16.5C18 16.2239 18.2239 16 18.5 16Z" fill="#050038"/>\n' +
                    '<path d="M26.5 16H29.5C29.7761 16 30 16.2239 30 16.5V19.5C30 19.7761 29.7761 20 29.5 20H26.5C26.2239 20 26 19.7761 26 19.5V16.5C26 16.2239 26.2239 16 26.5 16Z" fill="#050038"/>\n' +
                    '<path d="M34.5 24H37.5C37.7761 24 38 24.2239 38 24.5V27.5C38 27.7761 37.7761 28 37.5 28H34.5C34.2239 28 34 27.7761 34 27.5V24.5C34 24.2239 34.2239 24 34.5 24Z" fill="#050038"/>\n' +
                    '<path d="M10.5 24H13.5C13.7761 24 14 24.2239 14 24.5V27.5C14 27.7761 13.7761 28 13.5 28H10.5C10.2239 28 10 27.7761 10 27.5V24.5C10 24.2239 10.2239 24 10.5 24Z" fill="#050038"/>\n' +
                    '<path d="M18.5 24H21.5C21.7761 24 22 24.2239 22 24.5V27.5C22 27.7761 21.7761 28 21.5 28H18.5C18.2239 28 18 27.7761 18 27.5V24.5C18 24.2239 18.2239 24 18.5 24Z" fill="#050038"/>\n' +
                    '<path d="M26.5 24H29.5C29.7761 24 30 24.2239 30 24.5V27.5C30 27.7761 29.7761 28 29.5 28H26.5C26.2239 28 26 27.7761 26 27.5V24.5C26 24.2239 26.2239 24 26.5 24Z" fill="#050038"/>',

                onClick: async function () {
                    if (await authorizer.authorized()) {
                        let viewport = await miro.board.viewport.getViewport();
                        let x = viewport.x + 0.3 * viewport.width;
                        let y = viewport.y + 0.3 * viewport.height;
                        let randomId = makeid(10);

                        //todo: below should be rewritten once it is parametrised an user can actually select which months he wants to add, but maybe, just maybe... this is sufficient? :)
                        drawIt(x, y, moment(), randomId);
                        let boardHeight = MONTH_BOX_HEIGHT+DAY_BOX_HEIGHT*6+DAY_NAME_HEIGHT;
                        drawIt(x, y-boardHeight, moment().add(-1, 'month'), randomId);

                        drawIt(x, y+boardHeight, moment().add(1, 'month'), randomId);
                        drawIt(x, y+2*boardHeight, moment().add(2, 'month'), randomId);
                        drawIt(x, y+3*boardHeight, moment().add(3, 'month'), randomId);
                    }
                }
            }

        }
    })
})
