M.gradingform_simplefeedbackrubric = {};

/**
 * This function is called for each simplefeedbackrubric on page.
 */
M.gradingform_simplefeedbackrubric.init = function(Y, options) {

    Y.on('click', M.gradingform_simplefeedbackrubric.levelclick, '#simplefeedbackrubric-'+options.name+' .level', null, Y, options.name);
    Y.all('#simplefeedbackrubric-'+options.name+' .radio').setStyle('display', 'none')
    Y.all('#simplefeedbackrubric-'+options.name+' .level').each(function (node) {
      if (node.one('input[type=radio]').get('checked')) {
        node.addClass('checked');
      }
    });
};

M.gradingform_simplefeedbackrubric.levelclick = function(e, Y, name) {
    var el = e.target
    while (el && !el.hasClass('level')) el = el.get('parentNode')
    if (!el) return

    var elementid = e._currentTarget.id;
    var pattern = new RegExp(/(?:advancedgrading-criteria-)(.*?)(?:-levels-)(\d+)/);
    var matches = elementid.match(pattern);
    var criteria = matches[1];
    var levels = matches[2];

    // The current text in the comment
    var currentcommenttext = Y.one('.editor_atto_content')._node.innerHTML;

    // The text in the rubric block which has been clicked
    var clickedleveltext = e._currentTarget.innerText.trim();

    // The text in any previously selected rubric sibling block
    var siblingtext = null;
    var siblingcriteria = null;
    var siblinglevel = null;

    el.siblings().each(function(sibling) {
        if (sibling.hasClass('checked')) {
            siblingtext = sibling._node.innerText;
            var siblingid = sibling._node.id;
            var siblingmatches = siblingid.match(pattern);
            siblingcriteria = siblingmatches[1];
            siblinglevel = siblingmatches[2];
            return false;
        }
    });

    // Construct the new text for the comment
    var newcommenttext = null;

    // If a sibling rubric block is currently selected
    if (siblingtext) {

        // If the current comment text already contains the selected sibling block text,
        // replace the contained sibling text string with the clicked rubric string
        if (currentcommenttext.match(new RegExp('(<span name="comment-criteria-'+siblingcriteria+'-levels-'+siblinglevel+'"><p>.*?<\/p><\/span>)'))) {
            newcommenttext = currentcommenttext.replace(
                new RegExp(
                    '(<span name="comment-criteria-'+siblingcriteria+'-levels-'+siblinglevel+'"><p>.*?<\/p><\/span>)'),
                    '<span name="comment-criteria-'+criteria+'-levels-'+levels+ '"><p>'+clickedleveltext+'</p></span>'
            );

        // If the current comment text does not contain the selected sibling block text...
        } else {
            // ...it should
            newcommenttext = currentcommenttext+' '+'<span name="comment-criteria-'+criteria+'-levels-'+levels+'"><p>'+clickedleveltext+'</p></span>';
        }

    // If no sibling rubric block is currently selected
    } else {

        // If we are deselecting the rubric item, remove the rubric text string from the comment text
        if (el.hasClass('checked')) {
            newcommenttext = currentcommenttext.replace(
                new RegExp('(<span name="comment-criteria-'+criteria+'-levels-'+levels+'"><p>.*?<\/p><\/span>)'),
                ''
            );
        // If we are selecting the rubric item, add the rubric item text string to the comment text
        } else {

            // If current comment text does not contain the clicked rubric item text
            if (!currentcommenttext.match(new RegExp('(<span name="comment-criteria-'+criteria+'-levels-'+levels+'"><p>.*?<\/p><\/span>)'))) {
                newcommenttext = currentcommenttext+' '+'<span name="comment-criteria-'+criteria+'-levels-'+levels+'"><p>'+clickedleveltext+'</p></span>';
            }
        }
    }

    if (newcommenttext) {
        Y.one('.editor_atto_content').setContent(newcommenttext);
        var x = window.scrollX, y = window.scrollY;
        Y.one('.editor_atto_content').focus();
        window.scrollTo(x, y);
    }

    e.preventDefault();
    el.siblings().removeClass('checked');
    chb = el.one('input[type=radio]')
    if (!chb.get('checked')) {
        chb.set('checked', true)
        el.addClass('checked')
    } else {
        el.removeClass('checked');
        el.get('parentNode').all('input[type=radio]').set('checked', false)
    }
}
