import { atom } from 'recoil';

export const MainFrameStateMenuOpened = atom<boolean>({
  key: 'MainFrameStateMenuOpened',
  default: false,
});
