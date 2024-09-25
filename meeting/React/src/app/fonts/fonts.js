import josefinSlabEOT from './josefin-slab-v18-latin-regular.eot';
import josefinSlabWoff from './josefin-slab-v18-latin-regular.woff';
import josefinSlabWoff2 from './josefin-slab-v18-latin-regular.woff2';
import josefinSlabTTF from './josefin-slab-v18-latin-regular.ttf';
import josefinSlabSVG from './josefin-slab-v18-latin-regular.svg';
import quicksandEOT from './quicksand-v28-latin-regular.eot';
import quicksandWoff from './quicksand-v28-latin-regular.woff';
import quicksandWoff2 from './quicksand-v28-latin-regular.woff2';
import quicksandTTF from './quicksand-v28-latin-regular.ttf';
import quicksandSVG from './quicksand-v28-latin-regular.svg';

const GlobalStyle = createGlobalStyle`
    background-color: AliceBlue;
    @font-face {
        font-family: 'Josefin Slab';
        src: local('Josefin Slab'), local('JosefinSlab'),
        url(${josefinSlabEOT}) format('embedded-opentype'),  /* IE9 Compat Modes */
				url(${josefinSlabWoff}) format('woff'),   /* Modern Browsers */
				url(${josefinSlabWoff2}) format('woff2'),  /* Super Modern Browsers */
				url(${josefinSlabTTF}) format('ttf'),     /* Safari, Android, iOS */
				url(${josefinSlabSVG}) format('svg');     /* Legacy iOS */
        font-weight: 400;
        font-style: normal;
    },
    @font-face {
        font-family: 'Quicksand';
        src: local('Quicksand'), 
        url(${quicksandEOT}) format('embedded-opentype'),  /* IE9 Compat Modes */
				url(${quicksandWoff}) format('woff'),   /* Modern Browsers */
				url(${quicksandWoff2}) format('woff2'),  /* Super Modern Browsers */
				url(${quicksandTTF}) format('ttf'),     /* Safari, Android, iOS */
				url(${quicksandSVG}) format('svg');     /* Legacy iOS */
        font-weight: 400;
        font-style: normal;
    }
`;

export default GlobalStyle;
