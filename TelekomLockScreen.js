// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: exchange-alt;
const DEBUG = false;
const log = DEBUG ? console.log.bind(console) : function () { };

let params = getParams(args.widgetParameter);

// Get Progress Circle service
let ProgressCircleService = await getService(
    "ProgressCircle",
    "https://gist.githubusercontent.com/Sillium/4210779bc2d759b494fa60ba4f464bd8/raw/9e172bac0513cc3cf0e70f3399e49d10f5d0589c/ProgressCircleService.js",
    DEBUG
);

// Get Telekom data service
let TelekomDataService = await getService(
    "TelekomData",
    "https://gist.githubusercontent.com/Sillium/0ef7decee63fc57d52a564d9982c0525/raw/d16253de7b6540eec00b500d0fedfe4567c9da2b/TelekomDataService.js",
    DEBUG
);
let tds = new TelekomDataService();
await tds.update();
let percent = (params.show === "used") ? tds.usedPercentage : tds.availablePercentage;
log("Percent: " + percent);

const widget = new ListWidget()

let progressStack = await ProgressCircleService.drawArc(widget, percent);

// Get Provider image
let providerImage = await getImage(params.provider + "-lockscreen.png", DEBUG);
sf = progressStack.addImage(providerImage);
sf.imageSize = new Size(26, 26);
sf.imageOpacity = (tds.source === "CACHE" ) ? 0.4 : 1;

widget.presentAccessoryCircular(); // Does not present correctly
Script.setWidget(widget);
Script.complete();

// get library from local filestore or download it once
async function getService(name, url, forceDownload) {
    const fm = FileManager.local();
    const scriptDir = module.filename.replace(fm.fileName(module.filename, true), '');
    let serviceDir = fm.joinPath(scriptDir, "lib/service/" + name);

    if (!fm.fileExists(serviceDir)) {
        fm.createDirectory(serviceDir, true);
    }

    let libFile = fm.joinPath(scriptDir, "lib/service/" + name + "/index.js");
    
    if (fm.fileExists(libFile) && !forceDownload) {
        fm.downloadFileFromiCloud(libFile);
    } else {
        // download once
        let indexjs = await loadText(url);
        fm.write(libFile, indexjs);
    }

    let service = importModule("lib/service/" + name);

    return service;
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
            case 'telekomold-lockscreen.png':
                imageUrl = "https://i.imgur.com/wKlfHIM.png";
                break;
            case 'telekom-lockscreen.png':
                imageUrl = "https://i.imgur.com/Cvzg0ea.png";
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
