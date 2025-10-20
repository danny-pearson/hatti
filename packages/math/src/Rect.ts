class Rect extends DOMRect {
    public toArray() {
        return [this.x, this.y, this.width, this.height];
    }
}

export default Rect;
