import PdfImgges from "../../style/assets/images/pdfnew.png";
import DocfImages from "../../style/assets/images/doc.png";

export const imageShow = (src, theme) => {
  return (
    <img
      src={src}
      className="post_img"
      alt="uploaded Images"
      style={{ cursor: "pointer" }}
      onClick={() => window.open(src, "_blank")}
    />
  );
};

export const videoShow = (src, theme) => {
  return <video controls src={src} className="post_img" alt="uploaded pics" />;
};

export const pdfShow = (src, theme) => {
  return (
    <img
      src={PdfImgges.src}
      className="post_img"
      alt="uploaded pics"
      style={{ cursor: "pointer" }}
      onClick={() => window.open(src, "_blank")}
    />
  );
};

export const docShow = (src, theme) => {
  return (
    <img
      src={DocfImages.src}
      className="post_img"
      alt="uploaded pics"
      style={{ cursor: "pointer" }}
      onClick={() => window.open(src, "_blank")}
    />
  );
};
