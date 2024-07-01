import React, { useState, useContext, useMemo } from 'react';
import { HolderOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Table } from 'antd';
import Title from 'antd/es/typography/Title';

const RowContext = React.createContext({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{
        cursor: 'move',
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Rule',
    dataIndex: 'rule',
    render: (rules, record) => (
      <div className="rule-box">
        <div className="rule-header">Rule</div>
        {rules.map((rule, index) => (
          <div key={index} className="rule-row">
            <select value={rule.field} readOnly>
              <option value="Location">Location</option>
              <option value="Title">Title</option>
              <option value="Location Radius">Location Radius</option>
            </select>
            <select value={rule.condition} readOnly>
              <option value="Is Equal To">Is Equal To</option>
              <option value="Like">Like</option>
              <option value="Is Less than">Is Less than</option>
            </select>
            <input type="text" value={rule.value} readOnly />
            <CloseOutlined className="remove-btn" onClick={() => record.removeRule(index)} />
          </div>
        ))}
        <Button type="dashed" icon={<PlusOutlined />} className="add-rule-btn" onClick={record.addRule}>
          Add Rule
        </Button>
      </div>
    ),
  },
  {
    title: 'TAM',
    dataIndex: 'tam',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Created',
    dataIndex: 'created',
  },
  {
    title: 'No of Jobs',
    dataIndex: 'jobs',
  },
  {
    key: 'sort',
    align: 'center',
    width: 80,
    render: () => <DragHandle />,
  },
];

const initialData = [
  {
    key: '1',
    name: 'Rule 1',
    rule: [
      { field: 'Location', condition: 'Is Equal To', value: 'California' },
      { field: 'Title', condition: 'Like', value: 'Nurse' },
      { field: 'Location Radius', condition: 'Is Less than', value: '50 Miles' },
    ],
    tam: 'XXXXXX XXXXXX',
    description: 'Description 1 XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX',
    created: 'April 18th 2024',
    jobs: 100,
  },
  {
    key: '2',
    name: 'Rule 2',
    rule: [
      { field: 'Location', condition: 'Is Equal To', value: 'New York' },
      { field: 'Location Radius', condition: 'Is Less than', value: '25 Miles' },
    ],
    tam: 'XXXXXX XXXXXX',
    description: 'Description 2 XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX',
    created: 'April 18th 2024',
    jobs: 50,
  },
  {
    key: '3',
    name: 'Rule 3',
    rule: [
      { field: 'Location', condition: 'Is Equal To', value: 'Texas' },
    ],
    tam: 'XXXXXX XXXXXX',
    description: 'Description 3 XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX XXXXXXX',
    created: 'April 18th 2024',
    jobs: 10,
  },
];

const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9999,
        }
      : {}),
  };
  const contextValue = useMemo(
    () => ({
      setActivatorNodeRef,
      listeners,
    }),
    [setActivatorNodeRef, listeners],
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const JobRules = () => {
  const [dataSource, setDataSource] = useState(initialData);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex((record) => record.key === active?.id);
        const overIndex = prevState.findIndex((record) => record.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  const addRule = (key) => {
    setDataSource((prevState) =>
      prevState.map((record) => {
        if (record.key === key) {
          return {
            ...record,
            rule: [...record.rule, { field: '', condition: '', value: '' }],
          };
        }
        return record;
      })
    );
  };

  const removeRule = (key, index) => {
    setDataSource((prevState) =>
      prevState.map((record) => {
        if (record.key === key) {
          const newRules = [...record.rule];
          newRules?.splice(index, 1);
          return {
            ...record,
            rule: newRules,
          };
        }
        return record;
      })
    );
  };

  const modifiedData = dataSource.map((item) => ({
    ...item,
    addRule: () => addRule(item.key),
    removeRule: (index) => removeRule(item.key, index),
  }));

  return (
    <div className="table-container">
    <Title level={5}>Jobs Filtering Rules</Title>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={modifiedData?.map((i) => i.key)} strategy={verticalListSortingStrategy}>
          <Table
            rowKey="key"
            components={{
              body: {
                row: Row,
              },
            }}
            columns={columns}
            dataSource={modifiedData}
            pagination={false}
          />
        </SortableContext>
      </DndContext>
      <div className="table-buttons">
        <Button  danger>Cancel</Button>
        <Button type="primary" style={{ marginLeft: '10px' }}>Save</Button>
      </div>
    </div>
  );
};

export default JobRules;
