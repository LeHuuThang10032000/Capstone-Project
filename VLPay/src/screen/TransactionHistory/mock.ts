interface SubComponentServiceCategoryType {
  id: number;
  name: string;
  icon: string;
  order?: number;
}

export const FOOD_TYPES_SAMPLE: SubComponentServiceCategoryType[] = [
  {
    id: 1,
    icon: 'https://monngonmoingay.com/wp-content/uploads/2021/05/bun-gan-bo-500.jpg',
    name: 'Bún bò',
  },
  {
    id: 2,
    icon: 'https://banhmipho.vn/wp-content/uploads/2021/08/vuong.jpg-602x470.png',
    name: 'Bánh mì',
  },
  {
    id: 3,
    icon: 'https://cdn.forza.com.vn/wp-content/uploads/2021/07/cach-lam-mi-y-thom-ngon-chuan-vi-tai-nha-6.jpeg',
    name: 'Spaghetti',
  },
  {
    id: 4,
    icon: 'https://i.ytimg.com/vi/2DZT0ZK_kzY/maxresdefault.jpg',
    name: 'Gà rán',
  },
  {
    id: 5,
    icon: 'https://i.ytimg.com/vi/mW1ks8yVD1E/maxresdefault.jpg',
    name: 'Hủ tiếu',
  },
  {
    id: 6,
    icon: 'https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250313281452.jpg',
    name: 'Phở',
  },
  {
    id: 7,
    icon: 'https://cdn.beptruong.edu.vn/wp-content/uploads/2021/03/banh-bao-nhan-thit-dam-da-kho-quen.jpg',
    name: 'Bánh bao',
  },
  {
    id: 8,
    icon: 'https://media.foody.vn/res/g1/7834/prof/s/image-0434968f-200910114131.jpeg',
    name: 'Cơm tấm',
  },
  {
    id: 9,
    icon: 'https://cdn.tgdd.vn/Files/2020/03/09/1240897/cach-nau-chao-xuong-nong-hoi-ngon-mieng-nguoi-lon-tre-nho-deu-me-202003090832249764.jpg',
    name: 'Cháo',
  },
  {
    id: 10,
    icon: 'https://statics.vinpearl.com/banh-canh-10_1631867919.jpg',
    name: 'Bánh canh',
  },
];

export const HISTORY_TRANSACTION_SAMPLE = [
  {
    id: 1,
    month: 'Tháng 12',
    list_transaction: [
      {
        id: 1,
        money: '-1.000.000',
        description: 'Chuyển tiền tới Huu Loc',
        date: '09:14 - 06/12/2022',
      },
      {
        id: 2,
        money: '500.000',
        description: 'Nhận tiền từ Thanh Tuan',
        date: '09:14 - 06/12/2022',
      },
      {
        id: 3,
        money: '-100.000',
        description: 'Chuyển tiền tới Bao Nguyen',
        date: '09:14 - 06/12/2022',
      },
    ],
  },
  {
    id: 2,
    month: 'Tháng 11',
    list_transaction: [
      {
        id: 1,
        money: '-1.000.000',
        description: 'Chuyển tiền tới Huu Loc',
        date: '09:14 - 06/11/2022',
      },
      {
        id: 2,
        money: '700.000',
        description: 'Nhận tiền từ Thanh Tuan',
        date: '09:14 - 06/11/2022',
      },
      {
        id: 3,
        money: '-100.000',
        description: 'Chuyển tiền tới Bao Nguyen',
        date: '09:14 - 06/11/2022',
      },
    ],
  },
  {
    id: 3,
    month: 'Tháng 10',
    list_transaction: [
      {
        id: 1,
        money: '-10.000.000',
        description: 'Chuyển tiền tới Big Boss',
        date: '11:11 - 29/10/2022',
      },
    ],
  },
  {
    id: 4,
    month: 'Tháng 9',
    list_transaction: [
      {
        id: 1,
        money: '1.000.000',
        description: 'Nhận tiền từ Diễm My',
        date: '06:14 - 03/09/2022',
      },
      {
        id: 2,
        money: '500.000',
        description: 'Nhận tiền từ Cao Mỹ Lệ',
        date: '02:14 - 05/09/2022',
      },
      {
        id: 3,
        money: '-100.000',
        description: 'Chuyển tiền tới Bích Thì',
        date: '10:30 - 11/09/2022',
      },
      {
        id: 4,
        money: '50.000',
        description: 'Nhận tiền từ Lâm Tâm Như',
        date: '11:00 - 01/09/2022',
      },
    ],
  },
];
