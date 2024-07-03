import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { grey } from 'theme';

import {
  Box,
  Chip,
  IconButton,
  List,
  Theme,
  Tooltip,
  useTheme
} from '@mui/material';

import { useApi, useChatData } from '@chainlit/react-client';

import { Translator } from 'components/i18n';

import DeleteIcon from 'assets/delete';

import { apiClientState } from 'state/apiClient';

import { Data, IDataLayer } from './Data';

// Define the type for the props
interface Props {
  handleClick: (id: string) => void;
  isMobile: boolean;
}

// Define the type for the props Header
interface PropsHeader {
  handleClick: (id: string) => void;
  status: string;
  elementId: string;
}

const Header = ({ status, handleClick, elementId }: PropsHeader) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        padding: theme.spacing(2)
      }}
    >
      <Box
        sx={{
          flexGrow: '1',
          fontWeight: '600',
          paddingLeft: theme.spacing(1),
          fontFamily: theme.typography.fontFamily
        }}
      >
        <Translator path="components.molecules.datalayer.DataLayer.title" />
      </Box>
      <Chip
        label={status || '?'}
        sx={{
          fontWeight: '500',
          borderRadius: '4px',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.mode === 'dark' ? grey[500] : grey[600]
        }}
      />
      <Box>
        <Tooltip
          title={
            <Translator path="components.molecules.datalayer.DataLayer.delete" />
          }
        >
          <IconButton
            id="chat-settings-open-modal"
            disabled={false}
            color="inherit"
            onClick={() => handleClick(elementId)}
          >
            <DeleteIcon sx={{ height: 22, width: 22, color: 'red' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const taskListContainerStyles = (theme: Theme) => ({
  background: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.divider}`,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: theme.typography.fontFamily!,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 4px 20px 0px rgba(0, 0, 0, 0.20)'
      : '0px 4px 20px 0px rgba(0, 0, 0, 0.05)'
});

const DataLayer = ({ isMobile, handleClick }: Props) => {
  const theme = useTheme();
  const { datalayers } = useChatData();
  const apiClient = useRecoilValue(apiClientState);

  console.log('datalayers====', datalayers);

  const datalayer = datalayers[datalayers.length - 1];

  // We remove the base URL since the useApi hook is already set with a base URL.
  // This ensures we only pass the relative path and search parameters to the hook.
  const url = useMemo(() => {
    if (!datalayer?.url) return null;
    const parsedUrl = new URL(datalayer.url);
    return parsedUrl.pathname + parsedUrl.search;
  }, [datalayer?.url]);

  const { isLoading, error, data } = useApi<IDataLayer>(
    apiClient,
    url ? url : null,
    {
      keepPreviousData: true
    }
  );

  console.log('url====url===', url);

  if (!url) return null;

  if (isLoading && !data) {
    return (
      <div>
        <Translator path="components.molecules.datalayer.DataLayer.loading" />
      </div>
    );
  } else if (error) {
    return (
      <div>
        <Translator path="components.molecules.datalayer.DataLayer.error" />
      </div>
    );
  }

  const content = data as IDataLayer;

  console.log('content=====', content);

  if (!content) {
    return null;
  }

  const dataset = content.dataset;

  console.log('dataset=====', dataset);

  if (isMobile) {
    // Get the first running or ready task, or the latest task
    let highlightedTaskIndex = dataset.length - 1;
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].status === 'running' || dataset[i].status === 'ready') {
        highlightedTaskIndex = i;
        break;
      }
    }
    const highlightedTask = dataset?.[highlightedTaskIndex];

    console.log('highlightedTask====', highlightedTask);

    return (
      <Box
        component="aside"
        sx={{
          color: theme.palette.text.primary,
          padding: theme.spacing(2),
          width: '100%',
          boxSizing: 'border-box',
          display: {
            xs: 'flex',
            md: 'none'
          }
        }}
        className="tasklist tasklist-mobile"
      >
        <Box
          sx={{
            ...taskListContainerStyles(theme)
          }}
        >
          <Header
            status={content?.status}
            handleClick={(id) => handleClick(id)}
            elementId={datalayer.id}
          />
          {highlightedTask && (
            <List
              sx={{ overflow: 'auto', height: isMobile ? '100px' : 'auto' }}
            >
              <Data
                index={highlightedTaskIndex + 1}
                data={highlightedTask}
                isMobile={isMobile}
              />
            </List>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component="aside"
      sx={{
        color: theme.palette.text.primary,
        width: '380px',
        flexShrink: '0',
        display: {
          xs: 'none',
          md: 'flex'
        }
      }}
      className="tasklist tasklist-desktop"
    >
      <Box
        sx={{
          ...taskListContainerStyles(theme)
        }}
      >
        <Header
          status={content?.status}
          handleClick={(id: string) => handleClick(id)}
          elementId={datalayer.id}
        />
        <Box
          sx={{
            overflowY: 'auto'
          }}
        >
          <List>
            {dataset?.map((data, index) => (
              <Data
                key={index}
                index={index + 1}
                data={data}
                isMobile={isMobile}
              />
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export { DataLayer };
