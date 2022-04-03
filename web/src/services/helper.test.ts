import { daysInMonth, formatEndOfMonth, isAfter, isBefore, isSameDay } from './helper';

describe('formatEndOfMonth', () => {
  test('January', () => {
    const input = '2022-01-01';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-01-31');
  });
  test('February', () => {
    const input = '2022-02-03';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-02-28');
  });
  test('March', () => {
    const input = '2022-03-06';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-03-31');
  });
  test('April', () => {
    const input = '2022-04-08';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-04-30');
  });
  test('May', () => {
    const input = '2022-05-10';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-05-31');
  });
  test('June', () => {
    const input = '2022-06-12';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-06-30');
  });
  test('July', () => {
    const input = '2022-07-14';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-07-31');
  });
  test('August', () => {
    const input = '2022-08-16';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-08-31');
  });
  test('September', () => {
    const input = '2022-09-18';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-09-30');
  });
  test('October', () => {
    const input = '2022-10-20';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-10-31');
  });
  test('November', () => {
    const input = '2022-11-22';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-11-30');
  });
  test('December', () => {
    const input = '2022-12-24';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2022-12-31');
  });
  test('Leap Year', () => {
    const input = '2024-02-26';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2024-02-29');
  });
  test('April 1st, 2019', () => {
    const input = '2019-04-01';
    const actual = formatEndOfMonth(input);
    expect(actual).toEqual('2019-04-30');
  });
});

describe('daysInMonth', () => {
  describe('valid and invalid string inputs', () => {
    test('Valid string input YYYY-MM-DD', () => {
      const input = '2022-01-01';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Valid string input YYYY-MM-DDTHH:mm:ss', () => {
      const input = '2022-01-01:12:13:14';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Valid string input YYYY-MM-DDTHH:mm:ss.SSS', () => {
      const input = '2022-01-01:12:13:14.123';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Valid string input YYYY-MM-DDTHH:mm:ss.SSSZ', () => {
      const input = '2022-01-01:12:13:14.123Z';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Valid string input YYYY-MM-DDTHH:mm:ss.SSS+', () => {
      const input = '2022-01-01:12:13:14.123+08:00';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Invalid string input MM/DD/YY', () => {
      const input = '01/01/22';
      const actual = () => daysInMonth(input);
      expect(actual).toThrowError('01/01/22 is not a valid date string');
    });
  });
  describe('testing each month as a string', () => {
    test('January', () => {
      const input = '2022-01-01';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('February', () => {
      const input = '2022-02-03';
      const actual = daysInMonth(input);
      expect(actual).toEqual(28);
    });
    test('March', () => {
      const input = '2022-03-06';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('April', () => {
      const input = '2022-04-08';
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('May', () => {
      const input = '2022-05-10';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('June', () => {
      const input = '2022-06-12';
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('July', () => {
      const input = '2022-07-14';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('August', () => {
      const input = '2022-08-16';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('September', () => {
      const input = '2022-09-18';
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('October', () => {
      const input = '2022-10-20';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('November', () => {
      const input = '2022-11-22';
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('December', () => {
      const input = '2022-12-24';
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Leap year', () => {
      const input = '2024-02-03';
      const actual = daysInMonth(input);
      expect(actual).toEqual(29);
    });
    test('April 1st, 2019', () => {
      const input = '2019-04-01';
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
  });
  describe('testing each month as a Date', () => {
    test('January', () => {
      const input = new Date('2022-01-01');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('February', () => {
      const input = new Date('2022-02-03');
      const actual = daysInMonth(input);
      expect(actual).toEqual(28);
    });
    test('March', () => {
      const input = new Date('2022-03-06');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('April', () => {
      const input = new Date('2022-04-08');
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('May', () => {
      const input = new Date('2022-05-10');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('June', () => {
      const input = new Date('2022-06-12');
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('July', () => {
      const input = new Date('2022-07-14');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('August', () => {
      const input = new Date('2022-08-16');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('September', () => {
      const input = new Date('2022-09-18');
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('October', () => {
      const input = new Date('2022-10-20');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('November', () => {
      const input = new Date('2022-11-22');
      const actual = daysInMonth(input);
      expect(actual).toEqual(30);
    });
    test('December', () => {
      const input = new Date('2022-12-24');
      const actual = daysInMonth(input);
      expect(actual).toEqual(31);
    });
    test('Leap year', () => {
      const input = new Date('2024-02-03');
      const actual = daysInMonth(input);
      expect(actual).toEqual(29);
    });
  });
});

describe('isBefore', () => {
  test('true', () => {
    const d1 = new Date(Date.UTC(2022, 0, 10));
    const d2 = new Date(Date.UTC(2022, 0, 11));
    const actual = isBefore(d1, d2);
    expect(actual).toEqual(true);
  });
  test('false', () => {
    const d1 = new Date(Date.UTC(2022, 0, 11));
    const d2 = new Date(Date.UTC(2022, 0, 10));
    const actual = isBefore(d1, d2);
    expect(actual).toEqual(false);
  });
});

describe('isAfter', () => {
  test('true', () => {
    const d1 = new Date(Date.UTC(2022, 0, 11));
    const d2 = new Date(Date.UTC(2022, 0, 10));
    const actual = isAfter(d1, d2);
    expect(actual).toEqual(true);
  });
  test('false', () => {
    const d1 = new Date(Date.UTC(2022, 0, 10));
    const d2 = new Date(Date.UTC(2022, 0, 11));
    const actual = isAfter(d1, d2);
    expect(actual).toEqual(false);
  });
});

describe('isSameDay', () => {
  test('true, same time', () => {
    const d1 = new Date(Date.UTC(2022, 0, 10));
    const d2 = new Date(Date.UTC(2022, 0, 10));
    const actual = isSameDay(d1, d2);
    expect(actual).toEqual(true);
  });
  test('true, different time', () => {
    const d1 = new Date(Date.UTC(2022, 0, 10, 12, 12, 12, 12));
    const d2 = new Date(Date.UTC(2022, 0, 10, 22, 22, 22, 22));
    const actual = isSameDay(d1, d2);
    expect(actual).toEqual(true);
  });
  test('false, same time', () => {
    const d1 = new Date(Date.UTC(2022, 0, 10));
    const d2 = new Date(Date.UTC(2022, 0, 11));
    const actual = isSameDay(d1, d2);
    expect(actual).toEqual(false);
  });
  test('false, different time', () => {
    const d1 = new Date(Date.UTC(2022, 0, 10, 12, 12, 12, 12));
    const d2 = new Date(Date.UTC(2022, 0, 11, 22, 22, 22, 22));
    const actual = isSameDay(d1, d2);
    expect(actual).toEqual(false);
  });
});
