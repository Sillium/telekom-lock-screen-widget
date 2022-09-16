// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: exchange-alt;
const DEBUG = false
const log = DEBUG ? console.log.bind(console) : function () { };

const remainColor = Color.white()
const depletedColor = new Color("#333333");

let params = getParams(args.widgetParameter);

// Get Provider image
let providerImage = await getImage(params.provider + "-lockscreen.png", DEBUG);

// Get Telekom data service
let tds = await getTelekomDataService(DEBUG);

let percent = (params.show === "used") ? tds.usedPercentage : tds.availablePercentage;

log("Percent: " + percent);

// Create the widget
const widget = await createWidget(args.widgetParameter);

Script.setWidget(widget);
Script.complete();

// Preview the widget
if (!config.runsInWidget) {
    await widget.presentSmall();
}

/**
 * Create the widget
 * @param {{widgetParameter: string}} config widget configuration
 */
async function createWidget(widgetParameter) {
    log(JSON.stringify(widgetParameter, null, 2));

    const widget = new ListWidget();

    let canvas = drawArc(percent, providerImage);
    widgetImage = widget.addImage(canvas.getImage());
    widgetImage.imageSize = new Size(65, 65);
    widgetImage.imageOpacity = (tds.source === "CACHE" ) ? 0.4 : 1;
    widgetImage.centerAlignImage();

    return widget;
}

function sinDeg(deg) {
	return Math.sin((deg * Math.PI) / 180);
}

function cosDeg(deg) {
	return Math.cos((deg * Math.PI) / 180);
}

function drawArc(percent, image) {
    const canvSize = 200;
    const canvas = new DrawContext();
    canvas.opaque = false;
    const canvWidth = 18; // circle thickness
    const canvRadius = 80; // circle radius
    canvas.size = new Size(canvSize, canvSize);
    canvas.respectScreenScale = true;

    const deg = Math.floor(percent * 3.6);

	let ctr = new Point(canvSize / 2, canvSize / 2);
	bgx = ctr.x - canvRadius;
	bgy = ctr.y - canvRadius;
	bgd = 2 * canvRadius;
	bgr = new Rect(bgx, bgy, bgd, bgd);

	canvas.opaque = false;

	canvas.setFillColor(remainColor);
	canvas.setStrokeColor(depletedColor);
	canvas.setLineWidth(canvWidth);
	canvas.strokeEllipse(bgr);

	for (t = 0; t < deg; t++) {
		rect_x = ctr.x + canvRadius * sinDeg(t) - canvWidth / 2;
		rect_y = ctr.y - canvRadius * cosDeg(t) - canvWidth / 2;
		rect_r = new Rect(rect_x, rect_y, canvWidth, canvWidth);
		canvas.fillEllipse(rect_r);
	}

    const canvLabelRect = new Rect(
		canvSize / 2 - 50,
		canvSize / 2 - 50,
		100,
		100
	);

    i = canvas.drawImageInRect(image, canvLabelRect);

    return canvas;
}

// get library from local filestore or download it once
async function getTelekomDataService(forceDownload) {
    const fm = FileManager.local();
    const scriptDir = module.filename.replace(fm.fileName(module.filename, true), '');
    let serviceDir = fm.joinPath(scriptDir, "lib/service/TelekomData");

    if (!fm.fileExists(serviceDir)) {
        fm.createDirectory(serviceDir, true);
    }

    let libFile = fm.joinPath(scriptDir, "lib/service/TelekomData/index.js");
    
    if (fm.fileExists(libFile) && !forceDownload) {
        fm.downloadFileFromiCloud(libFile);
    } else {
        // download once
        let indexjs = await loadText("https://gist.githubusercontent.com/Sillium/0ef7decee63fc57d52a564d9982c0525/raw/d16253de7b6540eec00b500d0fedfe4567c9da2b/TelekomDataService.js");
        fm.write(libFile, indexjs);
    }

    let TelekomDataService = importModule("lib/service/TelekomData");
    let tds = new TelekomDataService();

    await tds.update();

    return tds;
}

// get images from local filestore or download them once
async function getImage(name, forceDownload) {
    let fm = FileManager.local();
    const scriptDir = module.filename.replace(fm.fileName(module.filename, true), '');
    let imgDir = fm.joinPath(scriptDir, "lib/img");

    if (!fm.fileExists(imgDir)) {
        fm.createDirectory(imgDir, true);
    }

    let imgFile = fm.joinPath(imgDir, name);

    if (fm.fileExists(imgFile) && !forceDownload) {
        fm.downloadFileFromiCloud(imgFile);
        return fm.readImage(imgFile);
    } else {
        // download once
        let imageUrl;
        switch (name) {
            case 'telekom-lockscreen.png':
                imageUrl = "https://i.imgur.com/wKlfHIM.png";
                break;
            case 'congstar-lockscreen.png':
                imageUrl = "https://i.imgur.com/TsxkIR3.png";
                break;
            case 'fraenk-lockscreen.png':
                imageUrl = "https://i.imgur.com/6Kz8aGW.png";
                break;
            default:
                log("Sorry, couldn't find ${image}.");
        }
        let img = await loadImage(imageUrl);
        fm.writeImage(imgFile, img);
        return img;
    }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl);
    return await req.loadImage();
}

// helper function to download a text file from a given url
async function loadText(textUrl) {
    const req = new Request(textUrl);
    return await req.load();
}

function getParams(widgetParams) {
    let provider = "telekom";
    let show = "available";
    
    if (widgetParams) {
        let split = widgetParams.split(';');
        provider = (split.length > 0) ? split[0] : provider;
        show = (split.length > 1) ? split[1] : show;
    }
    
    return { "provider": provider, "show": show };
}
