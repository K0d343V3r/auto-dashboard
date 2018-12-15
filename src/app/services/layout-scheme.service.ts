import { Injectable } from '@angular/core';

export class LayoutItem {
  constructor(public columnSpan: number = 1, public rowSpan: number = 1, public primary: boolean = false) { }
}

export class LayoutScheme {
  constructor(public columns: number, public items: LayoutItem[]) { }
}

@Injectable({
  providedIn: 'root'
})
export class LayoutSchemeService {
  private readonly zeroPrimarySchemes: LayoutScheme[] = [
    new LayoutScheme(1, [             // 0 primary, 1 secondary   
      new LayoutItem()
    ]),
    new LayoutScheme(2, [             // 0 primary, 2 secondary 
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(3, [             // 0 primary, 3 secondary 
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(2, [             // 0 primary, 4 secondary 
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(6, [             // 0 primary, 5 secondary 
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2)
    ]),
    new LayoutScheme(3, [             // 0 primary, 6 secondary 
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(12, [            // 0 primary, 7 secondary 
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3)
    ]),
    new LayoutScheme(4, [             // 0 primary, 8 secondary 
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(3, [             // 0 primary, 9 secondary 
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(12, [            // 0 primary, 10 secondary 
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3)
    ])
  ];

  private readonly onePrimarySchemes: LayoutScheme[] = [
    new LayoutScheme(this.zeroPrimarySchemes[0].columns, [  // (1 primary, 0 secondary) === (0 primary, 1 secondary)         
      new LayoutItem(this.zeroPrimarySchemes[0].items[0].columnSpan, this.zeroPrimarySchemes[0].items[0].rowSpan, true)
    ]),
    new LayoutScheme(1, [             // 1 primary, 1 secondary
      new LayoutItem(1, 2, true),
      new LayoutItem()
    ]),
    new LayoutScheme(2, [             // 1 primary, 2 secondary
      new LayoutItem(2, 2, true),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(3, [             // 1 primary, 3 secondary
      new LayoutItem(3, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(4, [             // 1 primary, 4 secondary
      new LayoutItem(4, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(12, [            // 1 primary, 5 secondary
      new LayoutItem(3, 2),
      new LayoutItem(6, 2, true),
      new LayoutItem(3, 2),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4)
    ]),
    new LayoutScheme(4, [             // 1 primary, 6 secondary
      new LayoutItem(),
      new LayoutItem(2, 3, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
    ]),
    new LayoutScheme(12, [             // 1 primary, 7 secondary
      new LayoutItem(3),
      new LayoutItem(6, 2, true),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4)
    ]),
    new LayoutScheme(4, [             // 1 primary, 8 secondary
      new LayoutItem(),
      new LayoutItem(2, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(5, [             // 1 primary, 9 secondary
      new LayoutItem(),
      new LayoutItem(3, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ])
  ];

  private readonly twoPrimarySchemes: LayoutScheme[] = [
    new LayoutScheme(this.zeroPrimarySchemes[1].columns, [  // (2 primary, 0 secondary) === (0 primary, 2 secondary)         
      new LayoutItem(this.zeroPrimarySchemes[1].items[0].columnSpan, this.zeroPrimarySchemes[1].items[0].rowSpan, true),
      new LayoutItem(this.zeroPrimarySchemes[1].items[1].columnSpan, this.zeroPrimarySchemes[1].items[1].rowSpan, true),
    ]),
    new LayoutScheme(2, [             // 2 primary, 1 secondary
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(2, 1)
    ]),
    new LayoutScheme(2, [             // 2 primary, 2 secondary
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(6, [             // 2 primary, 3 secondary
      new LayoutItem(3, 2, true),
      new LayoutItem(3, 2, true),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2)
    ]),
    new LayoutScheme(4, [             // 2 primary, 4 secondary
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(5, [            // 2 primary, 5 secondary
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem()
    ]),
    new LayoutScheme(8, [             // 2 primary, 6 secondary
      new LayoutItem(3, 2, true),
      new LayoutItem(3, 2, true),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2)
    ]),
    new LayoutScheme(6, [             // 2 primary, 7 secondary
      new LayoutItem(),
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2)
    ]),
    new LayoutScheme(12, [             // 2 primary, 8 secondary
      new LayoutItem(2),
      new LayoutItem(4, 2, true),
      new LayoutItem(4, 2, true),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3)
    ])
  ];

  private readonly threePrimarySchemes: LayoutScheme[] = [
    new LayoutScheme(this.zeroPrimarySchemes[2].columns, [  // (3 primary, 0 secondary) === (0 primary, 3 secondary)         
      new LayoutItem(this.zeroPrimarySchemes[2].items[0].columnSpan, this.zeroPrimarySchemes[2].items[0].rowSpan, true),
      new LayoutItem(this.zeroPrimarySchemes[2].items[1].columnSpan, this.zeroPrimarySchemes[2].items[1].rowSpan, true),
      new LayoutItem(this.zeroPrimarySchemes[2].items[2].columnSpan, this.zeroPrimarySchemes[2].items[2].rowSpan, true),
    ]),
    new LayoutScheme(3, [             // 3 primary, 1 secondary
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(3)
    ]),
    new LayoutScheme(6, [             // 3 primary, 2 secondary
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(3),
      new LayoutItem(3)
    ]),
    new LayoutScheme(3, [             // 3 primary, 3 secondary
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(12, [             // 3 primary, 4 secondary
      new LayoutItem(4, 2, true),
      new LayoutItem(4, 2, true),
      new LayoutItem(4, 2, true),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3)
    ]),
    new LayoutScheme(6, [            // 3 primary, 5 secondary
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(2, 2, true),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2)
    ]),
    new LayoutScheme(3, [             // 3 primary, 6 secondary
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(1, 2, true),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem(),
      new LayoutItem()
    ]),
    new LayoutScheme(12, [             // 3 primary, 7 secondary
      new LayoutItem(4, 2, true),
      new LayoutItem(4, 2, true),
      new LayoutItem(4, 2, true),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(4),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3),
      new LayoutItem(3)
    ])
  ];

  private readonly fourPrimarySchemes: LayoutScheme[] = [
    new LayoutScheme(this.zeroPrimarySchemes[3].columns, [  // (4 primary, 0 secondary) === (0 primary, 4 secondary)         
      new LayoutItem(this.zeroPrimarySchemes[3].items[0].columnSpan, this.zeroPrimarySchemes[3].items[0].rowSpan, true),
      new LayoutItem(this.zeroPrimarySchemes[3].items[1].columnSpan, this.zeroPrimarySchemes[3].items[1].rowSpan, true),
      new LayoutItem(this.zeroPrimarySchemes[3].items[2].columnSpan, this.zeroPrimarySchemes[3].items[2].rowSpan, true),
      new LayoutItem(this.zeroPrimarySchemes[3].items[3].columnSpan, this.zeroPrimarySchemes[3].items[3].rowSpan, true),
    ]),
    new LayoutScheme(5, [             // 4 primary, 1 secondary
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true),
      new LayoutItem(1, 2),
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true)
    ]),
    new LayoutScheme(5, [             // 4 primary, 2 secondary
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true),
      new LayoutItem(),
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true),
      new LayoutItem()
    ]),
    new LayoutScheme(5, [             // 4 primary, 3 secondary
      new LayoutItem(2, 3, true),
      new LayoutItem(2, 3, true),
      new LayoutItem(1, 2),
      new LayoutItem(1, 2),
      new LayoutItem(2, 3, true),
      new LayoutItem(2, 3, true),
      new LayoutItem(1, 2)
    ]),
    new LayoutScheme(4, [             // 4 primary, 4 secondary
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true),
      new LayoutItem(2, 1, true),
      new LayoutItem(1),
      new LayoutItem(1),
      new LayoutItem(1),
      new LayoutItem(1)
    ]),
    new LayoutScheme(10, [            // 4 primary, 5 secondary
      new LayoutItem(5, 1, true),
      new LayoutItem(5, 1, true),
      new LayoutItem(5, 1, true),
      new LayoutItem(5, 1, true),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2),
      new LayoutItem(2)
    ]),
    new LayoutScheme(6, [             // 4 primary, 6 secondary
      new LayoutItem(1, 2),
      new LayoutItem(2, 3, true),
      new LayoutItem(2, 3, true),
      new LayoutItem(1, 2),
      new LayoutItem(1, 2),
      new LayoutItem(1, 2),
      new LayoutItem(2, 3, true),
      new LayoutItem(2, 3, true),
      new LayoutItem(1, 2),
      new LayoutItem(1, 2)
    ])
  ];

  readonly maxLayoutItems: number = 10;

  constructor() { }

  getLayout(primaryItemCount: number, totalItemCount: number): LayoutScheme {
    if (totalItemCount > this.maxLayoutItems || primaryItemCount > totalItemCount) {
      throw "Invalid layout request.";
    } else if (totalItemCount === 0) {
      return new LayoutScheme(0, []);
    } else {
      switch (primaryItemCount) {
        case 0:
          return this.zeroPrimarySchemes[totalItemCount - primaryItemCount - 1];

        case 1:
          return this.onePrimarySchemes[totalItemCount - primaryItemCount];

        case 2:
          return this.twoPrimarySchemes[totalItemCount - primaryItemCount];

        case 3:
          return this.threePrimarySchemes[totalItemCount - primaryItemCount];

        case 4:
          return this.fourPrimarySchemes[totalItemCount - primaryItemCount];

        default:
          return this.zeroPrimarySchemes[totalItemCount - 1];
      }
    }
  }
}
