(function() {
  function init() {
    const ID_STYLES = 'shb-styles';
    const ID_SHOW_WINDOWS = 'show-windows-button';
    const ID_KILL_WINDOW = 'kill-window-button';

    var buttons = document.getElementById('software-buttons');
    if (!buttons) {
      console.log('shb-plus, no homebar found?');
      return;
    }

    // Clean up any old installs.
    function removeElement(id) {
      var old = document.getElementById(id);
      old && old.remove();
    }
    removeElement(ID_STYLES);
    removeElement(ID_SHOW_WINDOWS);
    removeElement(ID_KILL_WINDOW);

    // Inject inline styles
    var style = document.createElement('style');
    style.id = ID_STYLES;
    style.appendChild(document.createTextNode(`
      #${ID_SHOW_WINDOWS}, #${ID_KILL_WINDOW} {
        position: absolute;
        top: 0;
        height: 5rem;
        width: 7rem;
        padding: 0;
        pointer-events: all;
        background: transparent;
        border: none;
        color: white;
        font-size: 3rem;
        font-weight: bold;
      }

      #${ID_SHOW_WINDOWS}:active,
      #${ID_KILL_WINDOW}:active {
        color: #00caf2;
      }

      #${ID_SHOW_WINDOWS} {
        right: 1rem;
      }

      #${ID_KILL_WINDOW} {
        left: 1rem;
      }

      #${ID_KILL_WINDOW}.flip {
        animation-name: flip;
        animation-duration: 0.7s;
        backface-visibility: visible;
      }

      @media (orientation: landscape) {
        #${ID_SHOW_WINDOWS}, #${ID_KILL_WINDOW} {
          width: 100%;
          right: 0;
          left: unset;
        }

        #${ID_SHOW_WINDOWS} {
          top: 1.5rem;
          bottom: unset;
        }

        #${ID_KILL_WINDOW} {
          top: unset;
          bottom: 1.5rem;
        }
      }

    @keyframes flip {
      from {
        transform: perspective(40rem) rotate3d(0, 1, 0, -360deg);
        animation-timing-function: ease-out;
      }
      40% {
        transform: perspective(40rem) translate3d(0, 0, 15rem) rotate3d(0, 1, 0, -190deg);
        animation-timing-function: ease-out;
      }
      50% {
        transform: perspective(40rem) translate3d(0, 0, 15rem) rotate3d(0, 1, 0, -170deg);
        animation-timing-function: ease-in;
      }
      80% {
        transform: perspective(40rem) scale3d(.95, .95, .95);
        animation-timing-function: ease-in;
      }
      to {
        transform: perspective(40rem);
        animation-timing-function: ease-in;
      }
    }
    `));
    document.head.appendChild(style);

    var showWindows = document.createElement('button');
    showWindows.id = ID_SHOW_WINDOWS;
    showWindows.textContent = '▢';
    showWindows.addEventListener('touchstart', function() {
      if (window.wrappedJSObject.appWindowManager.taskManager.isShown()) {
        window.wrappedJSObject.appWindowManager.taskManager.hide();
      } else {
        window.dispatchEvent(new CustomEvent('taskmanagershow'));
      }
      if('vibrate' in navigator) {
        // ... vibrate for a second
        navigator.vibrate(50);
      }
    }, true);
    // Insert as first child so dead-space node prevents accidental clicks.
    buttons.insertBefore(showWindows, buttons.firstChild);

    var kill = document.createElement('button');
    kill.id = ID_KILL_WINDOW;
    kill.textContent = '☠';
    kill.addEventListener('touchstart', function() {
      var oldApp = window.wrappedJSObject.StackManager.getCurrent();
      if (oldApp) {
        kill.addEventListener('animationend', function afterFlip() {
          kill.removeEventListener('animationend', afterFlip);
          kill.classList.remove('flip');
        });
        kill.classList.add('flip');
        window.wrappedJSObject.SheetsTransition.begin('ltr');
        window.wrappedJSObject.SheetsTransition.snapLeft(1);
        window.wrappedJSObject.StackManager.goPrev();
        oldApp.kill();
      }
      if('vibrate' in navigator) {
        // ... vibrate for a second
        navigator.vibrate(50);
      }
    }, true);
    // Insert as first child so dead-space node prevents accidental clicks.
    buttons.insertBefore(kill, buttons.firstChild);
  }

  // Make sure we have the homebar element before booting.
  if (document.getElementById('software-buttons')) {
    init();
  } else {
    window.addEventListener('mozContentEvent', function readyListener(e) {
      if (e.detail.type === 'system-message-listener-ready') {
        window.removeEventListener('mozContentEvent', readyListener);
        init();
      }
    });
  }

}());
