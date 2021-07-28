const PLUGIN_NAME = 'code_view';
const BUTTON_TOOL_TIP = 'Toggle code view mode';

tinymce.PluginManager.add(PLUGIN_NAME, function(editor, url) {
  let isActive = true;
  editor.ui.registry.addButton(PLUGIN_NAME, {
    icon: 'sourcecode',
    tooltip: BUTTON_TOOL_TIP,
    onAction: function () {
      toggleCode(this, editor);
    }
  });

  $('#'+editor.id).on('change', function() {
      editor.setContent($(this).val());
  });

  const toggleCode = (elem, editor) => {
    isActive = !isActive;
    const aceID = 'ace-editor-'+editor.id;

    if (!isActive) {
      // Code mode
      editor.mode.set('readonly');
      $(`[aria-label="${BUTTON_TOOL_TIP}"]`).removeClass('tox-tbtn--disabled');
      $(`[aria-label="${BUTTON_TOOL_TIP}"]`).removeAttr('aria-disabled');
      $(`[aria-label="${BUTTON_TOOL_TIP}"]`).css('cursor', 'pointer');
      $(`[aria-label="${BUTTON_TOOL_TIP}"]`).find('svg').css('fill', '#222f3e');
      $('#'+editor.id)[0].value = editor.dom.decode(editor.getContent({ source_view: !0 }));
      $('#'+editor.id)
          .css('height', $(editor.getDoc()).height()+'px')
          .show();

      if (typeof ace !== 'undefined') {
        const textarea = $('#'+editor.id).hide();
        $('#'+editor.id).after('<div id="'+aceID+'"></div>');
        const aceEditor = ace.edit(aceID);

        aceEditor.$blockScrolling = 'Infinity';
        aceEditor.setTheme('ace/theme/chrome');
        aceEditor.session.setMode('ace/mode/html_ruby');
        aceEditor.setValue(textarea.val(), 1);
        aceEditor.setOptions({
            wrap: true,
            displayIndentGuides: true,
            highlightActiveLine: false,
            showPrintMargin: false,
            minLines: Math.round(300 / 17),
            maxLines: Math.round(300 / 17)
        });
        aceEditor.on('change', function () {
            textarea.val(aceEditor.getValue()).trigger('keyup');
            editor.setContent(aceEditor.getValue());
        });
      }
    } else {
      // Editor mode
      editor.mode.set('design');
      $('#'+editor.id)
          .hide();
      if (typeof ace !== 'undefined') {
          const aceEditor = ace.edit(aceID);
          aceEditor.destroy();
          $('#'+aceID).remove();
      }
    }
  };
});