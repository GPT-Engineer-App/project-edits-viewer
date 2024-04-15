import React, { useState } from "react";
import { Box, Button, Code, Heading, Select, Stack, Text, VStack } from "@chakra-ui/react";

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      setJsonData(data);
    };
    reader.readAsText(file);
  };

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const formatContent = (content) => {
    return content.split("\n").map((line, index) => (
      <Text key={index} whiteSpace="pre-wrap">
        {line}
      </Text>
    ));
  };

  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Internal Tool
      </Heading>

      <VStack align="stretch" spacing={4}>
        <Box>
          <Button as="label" htmlFor="file-upload" variant="outline">
            Upload JSON File
          </Button>
          <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
        </Box>

        {jsonData && (
          <Box>
            <Select placeholder="Select a project" value={selectedProject} onChange={handleProjectChange}>
              {Object.keys(jsonData.data).map((projectId) => (
                <option key={projectId} value={projectId}>
                  {projectId}
                </option>
              ))}
            </Select>
          </Box>
        )}

        {selectedProject && (
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Edits for {selectedProject}
            </Heading>
            <Stack spacing={4}>
              {Object.entries(jsonData.data[selectedProject])
                .sort((a, b) => new Date(b[1].created_at.__time__) - new Date(a[1].created_at.__time__))
                .map(([editId, edit]) => (
                  <Box key={editId} borderWidth={1} borderRadius="md" p={4}>
                    <Text fontWeight="bold" mb={2}>
                      Edit ID: {editId}
                    </Text>
                    <Text>Created At: {edit.created_at.__time__}</Text>
                    {edit.content && edit.content.output && (
                      <Box mt={4}>
                        <Heading as="h3" size="sm" mb={2}>
                          Content Output:
                        </Heading>
                        <Code p={2} whiteSpace="pre-wrap">
                          {formatContent(edit.content.output)}
                        </Code>
                      </Box>
                    )}
                  </Box>
                ))}
            </Stack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Index;
