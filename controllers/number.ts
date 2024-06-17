export const getNumString = (n?: string) => {
  if (typeof n === 'undefined') return;

  const num = Number.parseInt(n);
  if (isNaN(num)) throw Error(`${n} is not a number`);

  return num.toLocaleString();
};

export const shortenNumStringVar = (n?: string) => {
  if (typeof n === 'undefined') return;

  const num = Number.parseInt(n);
  if (isNaN(num)) throw Error(`${n} is not a number`);

  const f = Math.floor((n.length - 1) / 3);
  let nn: number;
  let postfix: string;
  switch (f) {
    case 0:
      postfix = '';
      nn = num / Math.pow(1000, f);
      break;
    case 1:
      postfix = 'K';
      nn = num / Math.pow(1000, f);
      break;
    case 2:
      postfix = 'Mn';
      nn = num / Math.pow(1000, f);
      break;
    case 3:
      postfix = 'Bn';
      nn = num / Math.pow(1000, f);
      break;
    default:
      postfix = 'Tn';
      nn = num / Math.pow(1000, 4);
      break;
  }
  const r = Math.round((nn + Number.EPSILON) * 10) / 10; // Precision of 1st decimal point
  return `${r.toLocaleString(undefined, { minimumFractionDigits: f === 0 ? 0 : 1 })} ${postfix}`;
};

export const shortenNumMillion = (n?: number) => {
  if (typeof n === 'undefined') return;

  const num = n / 1000000;

  const r = Math.round((num + Number.EPSILON) * 10) / 10; // Precision of 1st decimal point
  return `${r.toLocaleString(undefined, { minimumFractionDigits: 1 })} Mn`;
};
