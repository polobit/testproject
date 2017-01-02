(function () {
    "use strict";
        
    module.exports.pageContainer = "#page";
    
    module.exports.editableItems = {
        'div#agileform_div' : [],
        'span.fa': ['color', 'font-size'],
        '.bg.bg1,.item': ['background-color'],
        'nav': ['background-color','color'],
        '.pricing2 > .top' : ['background-color'],
        'header.wrapper' : ['background-color'],
        '.dividerel' : ['background-color'],
        'nav a': ['color', 'font-weight', 'text-transform', 'dynamic-button'],
        'img': ['width','height','border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-color', 'border-style', 'border-width', 'dynamic-image'],
        'hr.dashed': ['border-color', 'border-width'],
        '.divider > span': ['color', 'font-size'],
        'hr.shadowDown': ['margin-top', 'margin-bottom'],
        '.footer a': ['color'],
        '.social a': ['color'],
        '.bg.bg1, .bg.bg2, .header10, .header11, .search-box1': ['background-image', 'background-color'],
        '.frameCover': [],
        '.editContent': ['content', 'color', 'font-size', 'background-color', 'font-family', 'dynamic-text'],
        'a.btn, button.btn': ['border-radius', 'font-size', 'background-color','dynamic-button']
        
    };
    
    module.exports.editableItemOptions = {
        'nav a : font-weight': ['400', '700'],
        'nav a : dynamic-button': ['no', 'yes'],
        'a.btn, button.btn : dynamic-button': ['no', 'yes'],
        'a.btn : border-radius': ['0px', '4px', '10px'],
        'img : border-style': ['none', 'dotted', 'dashed', 'solid'],
        'img : border-width': ['1px', '2px', '3px', '4px'],
        'img : dynamic-image': ['no', 'yes'],
        '.editContent : dynamic-text': ['no', 'yes'],
        'h1, h2, h3, h4, h5, p : font-family': ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'],
        'h2 : font-family': ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'],
        'h3 : font-family': ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman'],
        'p : font-family': ['default', 'Lato', 'Helvetica', 'Arial', 'Times New Roman']
    };

    module.exports.responsiveModes = {
        desktop: '97%',
        mobile: '480px',
        tablet: '1024px'
    };

    module.exports.editableContent = ['.editContent', '.navbar a', 'button', 'a.btn', '.footer a:not(.fa)', '.tableWrapper', 'h1', 'h2'];

    module.exports.autoSaveTimeout = 300000;
    
    module.exports.sourceCodeEditSyntaxDelay = 10000;

    module.exports.mediumCssUrls = [
        '//cdn.jsdelivr.net/medium-editor/latest/css/medium-editor.min.css',
        'https://s3.amazonaws.com/agilecrm/pagebuilder/static/css/medium-bootstrap.css'
    ];
    module.exports.mediumButtons = ['bold', 'italic', 'underline', 'anchor', 'orderedlist', 'unorderedlist', 'h1', 'h2', 'h3', 'h4', 'removeFormat'];

    module.exports.externalJS = [
        'https://s3.amazonaws.com/agilecrm/pagebuilder/static/js/builder_in_block.js'
    ];
                    
}());