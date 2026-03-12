import "./Images.css";
import { Link } from "react-router";

export function ImageGrid({ images }) {
  return (
    <div className="ImageGrid">
      {images.map((image) => (
        <div key={image._id} className="ImageGrid-photo-container">
          <Link to={"/images/" + image._id}>
            <img src={image.src} alt={image.name} />
          </Link>
        </div>
      ))}
    </div>
  );
}