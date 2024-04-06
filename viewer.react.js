function Viewer(props) {
    const name = props.name;
    const files = props.files;
    const onBack = props.onBack;

    const [index, setIndex] = React.useState(0);

    const imagePath = window.location.href + `sheets/${name}/${files[index]}`;
    const prevImage = window.location.href + `sheets/${name}/${files[index-1]}`;
    const nextImage = window.location.href + `sheets/${name}/${files[index+1]}`;

    React.useEffect(() => {
        document.onkeyup = (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
                setIndex(oldIndex => {
                    if (oldIndex > 0) {
                        return oldIndex - 1;
                    }
                    return oldIndex;
                });
            }
            if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
                setIndex(oldIndex => {
                    if (oldIndex < (files.length - 1)) {
                        return oldIndex + 1;
                    }
                    return oldIndex;
                })
            }
        }
        return () => {
            document.onkeyup = null;
        }
    }, [files]);

    const onClick = React.useCallback((event) => {
        const screen = {
            x: window.innerWidth,
            y: window.innerHeight
        };
        const click = {
            x: event.pageX,
            y: event.pageY
        };

        if (click.y < (screen.y / 3)) {
            onBack();
        } else if (click.x < (screen.x / 2)) {
            setIndex(oldIndex => {
                if (oldIndex > 0) {
                    return oldIndex - 1;
                }
                return oldIndex;
            });
        } else {
            setIndex(oldIndex => {
                if (oldIndex < (files.length - 1)) {
                    return oldIndex + 1;
                }
                return oldIndex;
            })
        }
    }, [onBack, setIndex]);

    return (
        <div onClick={onClick} className="viewer-container">
            <img src={imagePath} key={imagePath} className="viewer-image" />
            <img src={prevImage} key={prevImage} className="viewer-image-hidden" />
            <img src={nextImage} key={nextImage} className="viewer-image-hidden" />
        </div>
    );
}