import * as sapper from '@sapper/app';
// import Typography from 'typography';
// import stAnnesTheme from 'typography-theme-st-annes';

// const typography = new Typography(stAnnesTheme);
// typography.injectStyles();

sapper.start({
	target: document.querySelector('#sapper')
});