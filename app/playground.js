import { spaceCfg } from './conf';
import * as ship from './generators/ship';
import { n2color, initCanvas } from './util/drawing';

const icon = initCanvas(32, 32);
icon.fillStyle = n2color(spaceCfg.background);
icon.fillRect(0, 0, 31, 31);
ship.create({ pixelSize: 3 }).show(icon, 5, 8);
favicon.href = icon.canvas.toDataURL();

playground.width = 800;
playground.height = 800;
