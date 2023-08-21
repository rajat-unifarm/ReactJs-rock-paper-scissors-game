export const rockPaperScissorAddress = (networkID) => {
    switch (networkID) {
        case 137:
            return "0x480E074012F7dfF1aF70851Ee4412BBB12814da4";
        case 997:
            return "0xe6774ea9eC37B29CcCd93B118718B9C9E1D0210C";
        default:
            return "";
    }
}  