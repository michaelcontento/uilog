import { infoWait, warnWait, errorWait } from './';

const ok = infoWait('Processing ...');
setTimeout(ok.done, 3000);

const error = warnWait('Waiting for a lock to be released ...');
setTimeout(error.error, 2000);

const hide = errorWait('Waiting for required clients ...');
setTimeout(hide.clear, 1000);

const download = infoWait('Downloading a file ...');
setTimeout(() => download.setProgress(5), 0);
setTimeout(() => download.setProgress(10), 500);
setTimeout(() => download.setProgress(20), 1000);
setTimeout(() => download.setProgress(30), 1500);
setTimeout(() => download.setProgress(40), 2000);
setTimeout(() => download.setProgress(50), 2500);
setTimeout(() => download.setProgress(60), 3000);
setTimeout(() => download.setProgress(70), 3500);
setTimeout(() => download.setProgress(80), 4000);
setTimeout(() => download.setProgress(90), 4500);
setTimeout(() => download.setProgress(100), 5000);
setTimeout(download.done, 5250);
