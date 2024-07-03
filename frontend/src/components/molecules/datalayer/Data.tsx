import { CodeBlock, atomOneDark, atomOneLight } from 'react-code-blocks';
import { useSetRecoilState } from 'recoil';
import { grey } from 'theme';

import { Box, List, ListItem, ListItemButton, useTheme } from '@mui/material';

import { highlightMessage } from 'state/project';

import { TaskStatusIcon } from './TaskStatusIcon';

export interface IData {
  title: string;
  status: 'ready' | 'running' | 'done' | 'failed';
  forId?: string;
  value?: any;
}

export interface IDataLayer {
  status: 'ready' | 'running' | 'done';
  dataset: IData[];
}

export const Data = ({
  index,
  data,
  isMobile
}: {
  index: number;
  data: IData;
  isMobile: boolean;
}) => {
  console.log('task==', data, index);
  const setHighlightedMessage = useSetRecoilState(highlightMessage);
  const theme = useTheme();
  return (
    <>
      <ListItem disableGutters className={`task task-status-${data.status}`}>
        <ListItemButton
          disableRipple={!data.forId}
          sx={{
            color:
              {
                ready: theme.palette.mode === 'dark' ? grey[300] : grey[700],
                running: theme.palette.mode === 'dark' ? grey[100] : grey[850],
                done: grey[500],
                failed: grey[500]
              }[data.status] || theme.palette.text.secondary,
            fontWeight: data.status === 'running' ? '700' : '500',
            alignItems: 'flex-start',
            fontSize: '14px',
            lineHeight: 1.36,
            cursor: data.forId ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (data.forId) {
              setHighlightedMessage(data.forId);
              const element = document.getElementById(`message-${data.forId}`);
              if (element) {
                element.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'start'
                });
              }
            }
          }}
        >
          <Box
            sx={{
              paddingRight: theme.spacing(1),
              flex: '0 0 18px',
              width: '18px'
            }}
          >
            {index}
          </Box>
          <TaskStatusIcon status={data.status} />
          <Box
            sx={{
              paddingLeft: theme.spacing(2)
            }}
          >
            {data.title}
          </Box>
        </ListItemButton>
      </ListItem>
      <List>
        {/* <div dangerouslySetInnerHTML={{ __html: row }} /> */}

        {data.value &&
          data.value.map((row: any) => (
            <Box
              sx={{
                color: theme.palette.text.primary,
                display: 'flex',
                overflowX: 'auto',
                maxWidth: '100%', // Or any specific width you prefer
                whiteSpace: isMobile ? 'wrap' : 'nowrap',
                backgroundColor:
                  theme.palette.mode === 'dark' ? grey[850] : grey[100],
                m: '2px'
              }}
            >
              <CodeBlock
                text={JSON.stringify(row)}
                language={'json'}
                showLineNumbers={false}
                theme={
                  theme.palette.mode === 'dark' ? atomOneDark : atomOneLight
                }
              />
            </Box>
          ))}
      </List>
    </>
  );
};
