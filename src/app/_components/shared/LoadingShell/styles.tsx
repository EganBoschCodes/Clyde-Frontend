import styled from 'styled-components';

import { mainStyles, screenStyles } from '../PageShell/styles';

export const Screen = styled.div`
  ${screenStyles}
`;

export const Main = styled.main<{ $isWide: boolean }>`
  ${mainStyles}
`;
