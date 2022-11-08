import { Color } from '../color.service';
import { randomRange } from '../functions.util';

export class Trait {
  main: { name: string; color: Color; generator?: Function }; // Основной цвет характеристики
  parts: Record<string, Color>; // Другие цвета характеристики
  rarity: number; // Редкость (от 0 до 1)
  frequency: number; // Частота (шанс выпадения с похожим цветом в процентах, от 0 до 100)

  constructor(
    mainFigure: { name: string; color: Color; generator?: Function } = {
      name: '',
      color: new Color(),
    },
    partsFigure: Record<string, Color> = {},
    frequency: number = 0,
  ) {
    this.main = mainFigure;
    this.parts = partsFigure;
    this.frequency = frequency;
  }

  setSaturation(s: number) {
    // { h, s, l }
    let mainColor = this.main.color;
    let mainHSL = mainColor.getHSL();

    mainColor.setHSL(mainHSL.h, s, mainHSL.l);

    for (const partName in this.parts) {
      const partColor = this.parts[partName];

      const partHSL = partColor.getHSL();
      partColor.setHSL(partHSL.h, s, partHSL.l);
    }
  }

  displaceHSL(displace: {
    h?: number;
    dh?: { min: number; max: number };
    s: number;
    l: number;
  }) {
    // { h, ks, kl }
    let mainColor = this.main.color;
    let mainHSL = mainColor.getHSL();

    if (displace.dh) {
      displace.h = randomRange(displace.dh.min, displace.dh.max) - mainHSL.h;
    }

    while (mainHSL.h + displace.h > 1) {
      displace.h -= 1;
    }
    while (mainHSL.h + displace.h < 0) {
      displace.h += 1;
    }

    //console.log(this.main.name, mainColor);
    mainColor.setHSL(
      mainHSL.h + displace.h,
      displace.s < 1
        ? mainHSL.s * displace.s
        : mainHSL.s + (1 - mainHSL.s) * (1 - 1 / displace.s),
      displace.l < 1
        ? mainHSL.l * displace.l
        : mainHSL.l + (1 - mainHSL.l) * (1 - 1 / displace.l),
    );
    //console.log(this.main.name, mainColor);

    //console.log(this.main.name, displace.s < 1 ? mainHSL.s * displace.s : mainHSL.s + (1 - mainHSL.s) * (1 - 1 / displace.s));
    for (const partName in this.parts) {
      const partColor = this.parts[partName];

      const partHSL = partColor.getHSL();
      //console.log(partName, displace.s < 1 ? partHSL.s * displace.s : partHSL.s + (1 - partHSL.s) * (1 - 1 / displace.s));
      partColor.setHSL(
        partHSL.h + displace.h,
        displace.s < 1
          ? partHSL.s * displace.s
          : partHSL.s + (1 - partHSL.s) * (1 - 1 / displace.s),
        displace.l < 1
          ? partHSL.l * displace.l
          : partHSL.l + (1 - partHSL.l) * (1 - 1 / displace.l),
      );
    }
  }
}
