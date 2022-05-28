function Viewer(props) {
    const name = props.name;
    const files = props.files;
    const onBack = props.onBack;

    const [index, setIndex] = React.useState(0);

    const imagePath = `sheets/${name}/${files[index]}`;

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
            <img src={imagePath} className="viewer-image" />
        </div>
    );
}