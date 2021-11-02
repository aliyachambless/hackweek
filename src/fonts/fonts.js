import { createGlobalStyle } from 'styled-components'

import LadiGross from './Ladi-Gross.otf';
import LadiWeak from './Ladi-Weak.otf';
import LadiDense from './Ladi-Dense.otf';

export default createGlobalStyle`
    @font-face {
        font-family: 'Ladi Gross';
        src: url(${LadiGross}) format("opentype");
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'Ladi Weak';
        src: url(${LadiWeak}) format("opentype");
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'Ladi Dense';
        src: url(${LadiDense}) format("opentype");
        font-weight: 300;
        font-style: normal;
    }
`;