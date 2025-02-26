import React, { FC } from "react";
import { getRoot, getType } from "mobx-state-tree";
import { observer } from "mobx-react";
import {
  ApartmentOutlined,
  AudioOutlined,
  LineChartOutlined,
  MessageOutlined
} from "@ant-design/icons";

import "./Node.styl";
import { Block, Elem } from "../../utils/bem";
import { IconBrushTool, IconBrushToolSmart, IconCircleTool, IconCircleToolSmart, IconKeypointsTool, IconKeypointsToolSmart, IconPolygonTool, IconPolygonToolSmart, IconRectangle3PointTool, IconRectangle3PointToolSmart, IconRectangleTool, IconRectangleToolSmart, IconText } from "../../assets/icons";
import { NodeView } from "./NodeView";

const NodeViews = {
  RichTextRegionModel: {
    name: "HTML",
    icon: IconText,
    getContent: (node: any) => <span style={{ color: "#5a5a5a" }}>{node.text}</span>,
    fullContent: (node: any) => (
      <div>
        {/* <div style={{ color: "#5a5a5a" }}>{node.text}</div> */}
        <div>{node.start}</div>
        <div>{node.startOffset}</div>
        <div>{JSON.stringify(node.globalOffsets, null, 2)}</div>
      </div>
    ),
  },

  ParagraphsRegionModel: NodeView({
    name: "Paragraphs",
    icon: IconText,
    getContent: node => <span style={{ color: "#5a5a5a" }}>{node.text}</span>,
  }),

  AudioRegionModel: NodeView({
    name: "Audio",
    icon: AudioOutlined,
  }),

  TimeSeriesRegionModel: NodeView({
    name: "TimeSeries",
    icon: LineChartOutlined,
  }),

  TextAreaRegionModel: NodeView({
    name: "Input",
    icon: MessageOutlined,
    getContent: node => <span style={{ color: "#5a5a5a" }}>{node._value}</span>,
  }),

  RectRegionModel: NodeView({
    name: "Rect",
    icon: IconRectangleTool,
    altIcon: IconRectangleToolSmart,
  }),

  Rect3PointRegionModel: NodeView({
    name: "Rect3Point",
    icon: IconRectangle3PointTool,
    altIcon: IconRectangle3PointToolSmart,
  }),

  VideoRectangleRegionModel: NodeView({
    name: "Video Rect",
    icon: IconRectangleTool,
    altIcon: IconRectangleToolSmart,
    getContent: node => <span style={{ color: "#5a5a5a" }}>from {node.sequence[0]?.frame} frame</span>,
  }),

  PolygonRegionModel: NodeView({
    name: "Polygon",
    icon: IconPolygonTool,
    altIcon: IconPolygonToolSmart,
  }),

  EllipseRegionModel: NodeView({
    name: "Ellipse",
    icon: IconCircleTool,
    altIcon: IconCircleToolSmart,
  }),

  // @todo add coords
  KeyPointRegionModel: NodeView({
    name: "KeyPoint",
    icon: IconKeypointsTool,
    altIcon: IconKeypointsToolSmart,
  }),

  BrushRegionModel: NodeView({
    name: "Brush",
    icon: IconBrushTool,
    altIcon: IconBrushToolSmart,
  }),

  ChoicesModel: NodeView({
    name: "Classification",
    icon: ApartmentOutlined,
  }),

  TextAreaModel: NodeView({
    name: "Input",
    icon: MessageOutlined,
  }),

  QuestionRegionModel: NodeView({
    name: "Question",
    icon: MessageOutlined,
  }),

  LanguagePairRegionModel: NodeView({
    name: "LanguagePair",
    icon: IconText,
    getContent: node => node.from_name.source && node.from_name.target
      ? (
        <span style={{ color: "#5a5a5a" }}>
          Language: <strong>{node.from_name.source}</strong> to <strong>{node.from_name.target}</strong>
        </span>
      )
      : (<>(no language specified)</>),
  }),

  AudioFileRegionModel: NodeView({
    name: "AudioFile",
    icon: AudioOutlined,
    getContent: node => node.from_name._data && node.from_name._type
      ? (
        <span style={{ color: "#5a5a5a" }}>
          Audio from <strong>{node.from_name._type}</strong>
        </span>
      )
      : (<>(no audio)</>),
  }),

  AudioRedactRegionModel: NodeView({
    name: "AudioRedact",
    icon: () => null,
    getContent: node => (
      <span style={{ color: "#f00" }}>
        Redact / {node.results[0].value.audioredact.start.toFixed(2)} - {node.results[0].value.audioredact.end.toFixed(2)}
      </span>
    ),
  }),
};

const NodeDebug: FC<any> = observer(({ className, node }) => {
  const name = useNodeName(node);

  if (!(name in NodeViews)) console.error(`No ${name} in NodeView`);

  const { getContent, fullContent } = NodeViews[name];
  const labelName = node.labelName;

  return (
    <Block name="node" className={[className].filter(Boolean).join(" ")}>
      {labelName}
      <br />
      {getContent(node)}
      {fullContent && fullContent(node)}
    </Block>
  );
});

const Node: FC<any> = observer(({ className, node }) => {
  const name = useNodeName(node);

  if (!(name in NodeViews)) {
    console.error(`No ${name} in NodeView`);
    return null;
  }

  const { getContent } = NodeViews[name];
  const labelName = node.labelName;

  return (
    <Block name="node" tag="span" className={className}>
      {labelName}
      {" "}
      {getContent(node)}
    </Block>
  );
});

const NodeIcon: FC<any> = observer(({ node, ...props }) => {
  const name = useNodeName(node);

  if (!(name in NodeViews)) {
    console.error(`No ${name} in NodeView`);
    return null;
  }

  const { icon: Icon } = NodeViews[name];

  return <Icon {...props}/>;
});

const NodeMinimal: FC<any> = observer(({ node }) => {
  const { sortedRegions: regions } = useRegionStore(node);
  const index = regions.indexOf(node);
  const name = useNodeName(node);

  if (!(name in NodeViews)) {
    console.error(`No ${name} in NodeView`);
    return null;
  }

  const { name: text, icon } = NodeViews[name];

  return (
    <Block name="node-minimal" tag="span">
      {index >= 0 && <Elem name="counter">{index + 1}</Elem>}

      <Elem name="icon" tag={icon}/>

      {text}
    </Block>
  );
});

const useNodeName = (node: any) => {
  return getType(node).name as keyof typeof NodeViews;
};

const useRegionStore = (node: any) => {
  const root = getRoot(node);

  return (root as any).annotationStore.selected.regionStore;
};

export { Node, NodeDebug, NodeIcon, NodeMinimal, NodeViews };
