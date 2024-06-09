const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);

const password = 'abc';

function sleep(ms) {
  return new Promise(r => {
    setTimeout(r, ms);
  })
}

let listeners = new Set();
function registerCommandListener(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  }
}
async function initializePassiveReceiver() {
  let lastId = '';
  for (;;) {
    try {
      const req = await fetch(`http://192.168.1.196:33518/music_key`, {
        method: 'POST',
        mode: "cors",
        cache: "no-cache",
      });
      const result = await req.json();
      const id = result.id;
      if (lastId !== id) {
        lastId = id;
        for (let listener of listeners) {
          listener(result);
        }
      }
    } catch (e) {
      console.error(e);
    }
    await sleep(33);
  }
}
void initializePassiveReceiver();

function Content() {
  const [selectedSheet, setSelectedSheet] = React.useState(null);

  const onBack = React.useCallback(() => {
    setSelectedSheet(null);
  }, [setSelectedSheet]);

  return (
    selectedSheet == null ? (
      <List onSelect={setSelectedSheet}></List>) :
      (<Viewer name={selectedSheet.name} files={selectedSheet.files} onBack={onBack}></Viewer>)
  )
}

async function sendCmd(cmd) {
  const req = await fetch(`http://192.168.1.196:33518/music_key_write`, {
    method: 'POST',
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cmd
    })
  });
  await req.json();
}

function Controller() {
  React.useEffect(() => {
    document.onkeyup = (e) => {
        if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
          sendCmd('prev');
        }
        if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
          sendCmd('next');
        }
        if (e.code === 'Enter') {
          sendCmd('enter');
        }
        if (e.code === 'Escape') {
          sendCmd('escape');
        }
        console.info(e.code);
    }
    return () => {
        document.onkeyup = null;
    }
  }, []);
  const styles = {
    controller: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(192, 147, 164)',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    item: {
      width: '50%',
      height: '50%',
      fontSize: '5vw',
      userSelect: 'none'
    }
  }
  return <div style={styles.controller}>
    <div style={{backgroundColor: '#d6bac7', ...styles.item}} onClick={() => {sendCmd('escape')}}>ESC</div>
    <div style={{backgroundColor: '#bbd1b8', ...styles.item}} onClick={() => {sendCmd('enter')}}>ENTER</div>
    <div style={{backgroundColor: '#cfceb6', ...styles.item}} onClick={() => {sendCmd('prev')}}>PREV</div>
    <div style={{backgroundColor: '#babbd6', ...styles.item}} onClick={() => {sendCmd('next')}}>NEXT</div>
  </div>
}

function Root() {
  const [passwordChecked, setPasswordChecked] = React.useState(false);
  const onChange = React.useCallback((event) => {
    if (event.target.value == password) {
      setPasswordChecked(true);
    }
  }, [setPasswordChecked]);
  const [rotated, setRotated] = React.useState(false);
  const [controllerVisible, setControllerVisible] = React.useState(false);
  if (controllerVisible) {
    return <Controller />
  }
  if (passwordChecked) {
    return <div className={`root-view ${rotated ? 'rotated' : ''}`}>
      <div onClick={() => {
        setRotated(previousValue => {
          const newRotated = !previousValue;
          return newRotated;
        })
      }}>
        Rotate
      </div>
      <div onClick={() => {
        setControllerVisible(true);
      }}>
        Controller
      </div>
      <Content />
    </div>
  } else {
    return <input autoFocus placeholder="passcode" className="root-pswd" type="password" onChange={onChange}></input>
  }
}

root.render(React.createElement(Root));
