import { useState, useEffect } from 'react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import {
  Group,
  Text,
  SimpleGrid,
  rem,
  Button,
  Card,
  Image,
  Badge,
  ActionIcon,
  Alert,
  Progress
} from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';

import PileatedApi from "../../services/PileatedApi.js";

const uploadApi = new PileatedApi('upload');

const ImageUploader = ({
                         onUploadComplete = () => {},
                         maxFiles = 5,
                         existingImages = [],
                         modelType = 'product',
                         modelId = null,
                         multiple = true
                       }) => {
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Preview images that are selected but not yet uploaded
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Card key={index} padding="xs" radius="md" withBorder>
        <Card.Section>
          <Image
            src={imageUrl}
            height={120}
            alt={`Upload preview ${index}`}
          />
        </Card.Section>
        <Group position="apart" mt="sm">
          <Text size="sm" weight={500} truncate>
            {file.name}
          </Text>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => removeSelectedFile(index)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
        <Text size="xs" color="dimmed">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </Text>
      </Card>
    );
  });

  const uploadedPreviews = uploadedImages.map((image, index) => {
    return (
      <Card key={`uploaded-${index}`} padding="xs" radius="md" withBorder>
        <Card.Section>
          <Image
            src={typeof image === 'string' ? image : image.url}
            height={120}
            alt={`Uploaded image ${index}`}
          />
        </Card.Section>
        <Group position="apart" mt="sm">
          <Badge color="green">Uploaded</Badge>
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => removeUploadedImage(index)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Card>
    );
  });

  const removeSelectedFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeUploadedImage = async (index) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;

    const imageToRemove = uploadedImages[index];
    let imageId;

    if (typeof imageToRemove === 'string') {
      const urlParts = imageToRemove.split('/');
      imageId = urlParts[urlParts.length - 1].split('.')[0];
    } else {
      imageId = imageToRemove.id;
    }

    try {
      const response = await fetch(`${apiEndpoint}/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    } catch (error) {
      setError('Failed to delete image: ' + error.message);
    }
  };

  const handleDrop = (newFiles) => {
    setFiles([...files, ...newFiles].slice(0, maxFiles));
    setError(null);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setProgress(0);
      const images = await uploadApi.uploadImages(modelId, modelType, files, setProgress)
      const imageUrls = images.image_urls
      setUploadedImages([...uploadedImages, ...imageUrls]);
      setFiles([]);
      onUploadComplete(imageUrls);
    } catch (error) {
      setError('Upload failed: ' + error.message);
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [files]);

  return (
    <div>
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => setError('Rejected files: ' + files.map(f => `${f.file.name} (${f.errors[0].message})`).join(', '))}
        maxSize={5 * 1024 * 1024} // 5MB
        accept={IMAGE_MIME_TYPE}
        loading={uploading}
        multiple={multiple}
        disabled={uploading || (files.length + uploadedImages.length) >= maxFiles}
        styles={{ root: { borderColor: error ? 'red' : undefined } }}
      >
        <Group position="center" spacing="xl" style={{ minHeight: rem(180), pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={rem(50)} stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={rem(50)} stroke={1.5} color="red" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={rem(50)} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline align="center">
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7} align="center">
              Attach up to {maxFiles} images, each file should not exceed 5MB
            </Text>
            {(files.length + uploadedImages.length) >= maxFiles && (
              <Text size="sm" color="red" align="center" mt={5}>
                Maximum number of files reached
              </Text>
            )}
          </div>
        </Group>
      </Dropzone>

      {error && (
        <Alert color="red" title="Error" withCloseButton onClose={() => setError(null)} mt="md">
          {error}
        </Alert>
      )}

      {uploading && (
        <Progress value={progress} mt="md" size="xl" radius="md" color="teal" animate />
      )}

      {(previews.length > 0 || uploadedPreviews.length > 0) && (
        <div style={{ marginTop: '1rem' }}>
          <Text weight={500} size="sm" mb="xs">
            {uploadedPreviews.length > 0 ? 'Current Images:' : ''}
          </Text>
          <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
            {uploadedPreviews}
          </SimpleGrid>

          {previews.length > 0 && (
            <>
              <Text weight={500} size="sm" mb="xs" mt="md">
                Selected Files:
              </Text>
              <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
                {previews}
              </SimpleGrid>
            </>
          )}
        </div>
      )}

      {files.length > 0 && (
        <Group position="right" mt="md">
          <Button
            onClick={() => setFiles([])}
            variant="outline"
            color="gray"
            disabled={uploading}
          >
            Clear
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            loading={uploading}
            color="blue"
          >
            {uploading ? `Uploading... ${progress}%` : 'Upload'}
          </Button>
        </Group>
      )}
    </div>
  );
};

export default ImageUploader;