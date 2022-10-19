import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainTable, Row, Tooltip } from "@canonical/react-components";
import { humanFileSize, isoTimeToString } from "./helpers";
import { fetchImageList } from "./api/images";
import NotificationRow from "./NotificationRow";
import DeleteImageBtn from "./buttons/images/DeleteImageBtn";
import { LxdImage } from "./types/image";
import { Notification } from "./types/notification";

const ImageList: FC = () => {
  const [images, setImages] = useState<LxdImage[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);

  const setFailure = (message: string) => {
    setNotification({
      message,
      type: "negative",
    });
  };

  const loadImages = async () => {
    try {
      const images = await fetchImageList();
      setImages(images);
    } catch (e) {
      setFailure("Could not load images.");
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const headers = [
    { content: "Alias" },
    { content: "Fingerprint", sortKey: "fingerprint" },
    { content: "Public", sortKey: "public", className: "u-align--center" },
    { content: "Description", sortKey: "description" },
    { content: "Arch", sortKey: "architecture", className: "u-align--center" },
    { content: "Type", sortKey: "type", className: "u-align--center" },
    { content: "Size", sortKey: "size", className: "u-align--center" },
    { content: "Upload date", sortKey: "uploaded_at" },
    { content: "Actions", className: "u-align--center" },
  ];

  const rows = images.map((image) => {
    const actions = (
      <div>
        <Tooltip message="Delete Image" position="left">
          <DeleteImageBtn
            image={image}
            onFailure={setFailure}
            onSuccess={loadImages}
          />
        </Tooltip>
      </div>
    );

    return {
      columns: [
        {
          content: image.aliases.join(", "),
          role: "rowheader",
          "aria-label": "Alias",
        },
        {
          content: image.fingerprint,
          role: "rowheader",
          "aria-label": "Fingerprint",
        },
        {
          content: image.public ? "yes" : "no",
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Public",
        },
        {
          content: image.properties.description,
          role: "rowheader",
          "aria-label": "Description",
        },
        {
          content: image.architecture,
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Architecture",
        },
        {
          content: image.type,
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Type",
        },
        {
          content: humanFileSize(image.size),
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Size",
        },
        {
          content: isoTimeToString(image.uploaded_at),
          role: "rowheader",
          "aria-label": "Upload date",
        },
        {
          content: actions,
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Actions",
        },
      ],
      sortData: {
        fingerprint: image.fingerprint,
        public: image.public,
        description: image.properties.description.toLowerCase(),
        architecture: image.architecture,
        type: image.type,
        size: image.size,
        uploaded_at: image.uploaded_at,
      },
    };
  });

  return (
    <>
      <div className="p-panel__header">
        <h4 className="p-panel__title">Images</h4>
        <div className="p-panel__controls">
          <Link
            className="p-button--positive u-no-margin--bottom"
            to="/images/add"
          >
            Add image
          </Link>
        </div>
      </div>
      <div className="p-panel__content">
        <NotificationRow
          notification={notification}
          close={() => {
            setNotification(null);
          }}
        />
        <Row>
          <MainTable
            headers={headers}
            rows={rows}
            paginate={30}
            responsive
            sortable
            className="p-table--images"
          />
        </Row>
      </div>
    </>
  );
};

export default ImageList;