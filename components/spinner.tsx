"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  animate,
  AnimationPlaybackControls,
} from "framer-motion";

interface SpinnerSegment {
  id: number;
  text: string;
  color: string;
}

interface SpinnerProps {
  segments?: SpinnerSegment[];
}

export function Spinner({
  segments = [
    { id: 1, text: "Childhood Favorites", color: "#404040" },
    { id: 2, text: "Cage", color: "#E0E0E0" },
    { id: 3, text: "Blind Spot", color: "#404040" },
    { id: 4, text: "Animation for Adults", color: "#E0E0E0" },
    { id: 5, text: "Subtitles", color: "#404040" },
    { id: 6, text: "Black and White", color: "#E0E0E0" },
  ],
}: SpinnerProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const [startAngle, setStartAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<SpinnerSegment>(
    segments[0],
  );
  const velocityRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastUpdateTimeRef = useRef(Date.now());
  const currentAnimationRef = useRef<AnimationPlaybackControls | null>(null); // Track current animation

  const SEGMENT_ANGLE = 360 / segments.length;
  const MIN_SPIN_DURATION = 2;
  const MAX_SPIN_DURATION = 6;
  const MIN_ROTATIONS = 1;
  const MAX_ROTATIONS = 5;
  const VELOCITY_DAMPENING = 0.5;

  // Calculate which segment is currently selected based on rotation
  const calculateSelectedSegment = useCallback(
    (currentRotation: number) => {
      // Normalize rotation to 0-360 range
      const normalizedRotation = ((currentRotation % 360) + 360) % 360;

      // The indicator points to the top (270 degrees in our coordinate system)
      // We need to account for the rotation offset
      const indicatorAngle = (270 - normalizedRotation + 360) % 360;

      // Find which segment this angle falls into
      const segmentIndex = Math.floor(indicatorAngle / SEGMENT_ANGLE);

      return segments[segmentIndex] || segments[0];
    },
    [segments, SEGMENT_ANGLE],
  );

  // Update selected segment helper
  const updateSelectedSegment = useCallback(
    (currentRotation: number) => {
      const selected = calculateSelectedSegment(currentRotation);
      setSelectedSegment(selected);
    },
    [calculateSelectedSegment],
  );

  function getWheelCenter(wheel: HTMLDivElement) {
    const rect = wheel.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  function createSegments() {
    return segments.map((segment: SpinnerSegment, index: number) => {
      const startAngle = SEGMENT_ANGLE * index;
      const endAngle = startAngle + SEGMENT_ANGLE;

      // Convert angles to radians for calculation
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate the endpoints of the arc
      const startX = Math.cos(startRad) * 150;
      const startY = Math.sin(startRad) * 150;
      const endX = Math.cos(endRad) * 150;
      const endY = Math.sin(endRad) * 150;

      // Construct the SVG path for a perfect circular segment
      const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;
      const pathData = [
        "M",
        0,
        0, // Move to center
        "L",
        startX,
        startY, // Line to start of arc
        "A",
        150,
        150,
        0,
        largeArcFlag,
        1,
        endX,
        endY, // Arc to end point
        "Z", // Close path
      ].join(" ");

      return (
        <g key={segment.id}>
          <path
            suppressHydrationWarning
            d={pathData}
            fill={segment.color}
            stroke="black"
            strokeWidth="2"
          />
          <text
            transform={`
              rotate(${startAngle + SEGMENT_ANGLE / 2})
              translate(100, 0)
              rotate(90)
            `}
            fill="black"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {segment.text.split(" ").map((word, wordIndex, words) => (
              <tspan
                key={wordIndex}
                x="0"
                dy={wordIndex === 0 ? `${-(words.length - 1) * 8}px` : "16px"}
              >
                {word}
              </tspan>
            ))}
          </text>
        </g>
      );
    });
  }

  // Calculate angle from center to point
  function getAngle(
    center: { x: number; y: number },
    point: { x: number; y: number },
  ) {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
  }

  // Stop any ongoing animation
  function stopSpinning() {
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
      currentAnimationRef.current = null;
      velocityRef.current = 0;
    }
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!wheelRef.current) return;

    stopSpinning();

    setIsDragging(true);
    const rect = wheelRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const point = { x: e.clientX, y: e.clientY };
    setStartAngle(getAngle(center, point) - rotation.get());

    // Reset velocity tracking
    velocityRef.current = 0;
    lastMousePosRef.current = point;
    lastUpdateTimeRef.current = Date.now();
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging || !wheelRef.current) return;

    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    const center = getWheelCenter(wheelRef.current);
    const point = { x: e.clientX, y: e.clientY };
    const currentAngle = getAngle(center, point);
    const newRotation = currentAngle - startAngle;

    // Calculate angular velocity
    const prevAngle = getAngle(center, lastMousePosRef.current);
    let angleDelta = currentAngle - prevAngle;

    // Handle angle wrapping
    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;

    // Update velocity with dampening factor
    velocityRef.current = (angleDelta / deltaTime) * VELOCITY_DAMPENING;

    // Update references
    lastMousePosRef.current = point;
    lastUpdateTimeRef.current = currentTime;

    rotation.set(newRotation);
    updateSelectedSegment(newRotation);
  }

  function handleMouseUp() {
    if (!isDragging) return;
    setIsDragging(false);

    const velocity = velocityRef.current;
    if (Math.abs(velocity) <= 0) return;

    const magnitude = Math.abs(velocity);
    const direction = velocity > 0 ? 1 : -1;

    const spinDuration = Math.min(
      MIN_SPIN_DURATION + magnitude / 200,
      MAX_SPIN_DURATION,
    );
    const numRotations = Math.min(
      MIN_ROTATIONS + magnitude / 100,
      MAX_ROTATIONS,
    );
    const targetRotation = rotation.get() + direction * 360 * numRotations;

    currentAnimationRef.current = animate(rotation, targetRotation, {
      duration: spinDuration,
      ease: [0.32, 0.72, 0.35, 1.0],
      onUpdate: (currentRotation) => {
        updateSelectedSegment(currentRotation);
      },
      onComplete: () => {
        velocityRef.current = 0;
        currentAnimationRef.current = null;
        updateSelectedSegment(targetRotation);
      },
    });
  }

  function handleMouseLeave() {
    if (isDragging) {
      handleMouseUp();
    }
  }

  // Add touch event handlers
  function handleTouchStart(e: React.TouchEvent) {
    if (!wheelRef.current) return;
    e.preventDefault(); // Prevent scrolling while touching the wheel

    stopSpinning();

    setIsDragging(true);
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const point = { x: touch.clientX, y: touch.clientY };
    setStartAngle(getAngle(center, point) - rotation.get());

    // Reset velocity tracking
    velocityRef.current = 0;
    lastMousePosRef.current = point;
    lastUpdateTimeRef.current = Date.now();
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging || !wheelRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    const center = getWheelCenter(wheelRef.current);
    const point = { x: touch.clientX, y: touch.clientY };
    const currentAngle = getAngle(center, point);
    const newRotation = currentAngle - startAngle;

    // Calculate angular velocity
    const prevAngle = getAngle(center, lastMousePosRef.current);
    let angleDelta = currentAngle - prevAngle;

    // Handle angle wrapping
    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;

    // Update velocity with dampening factor
    velocityRef.current = (angleDelta / deltaTime) * VELOCITY_DAMPENING;

    // Update references
    lastMousePosRef.current = point;
    lastUpdateTimeRef.current = currentTime;

    rotation.set(newRotation);
    updateSelectedSegment(newRotation);
  }

  function handleTouchEnd() {
    handleMouseUp(); // Reuse existing mouse up logic
  }

  return (
    <div className="relative mx-auto w-full max-w-md select-none">
      {/* Spinner Wheel */}
      <div className="relative">
        <motion.div
          ref={wheelRef}
          style={{
            rotate: rotation,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform",
            perspective: "1000px",
            transform: "translate3d(0,0,0)",
            WebkitTransform: "translate3d(0,0,0)",
          }}
          // @ts-expect-error -- TODO: Fix this type error
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`cursor-grab touch-none ${isDragging ? "cursor-grabbing" : ""} [backface-visibility:hidden] [transform-style:preserve-3d]`}
        >
          <svg
            viewBox="-155 -155 310 310"
            className="h-full w-full"
            style={{
              shapeRendering: "geometricPrecision",
              textRendering: "geometricPrecision",
            }}
          >
            {createSegments()}
          </svg>
        </motion.div>

        {/* Fixed Indicator Pointer */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="h-0 w-0 border-b-[20px] border-l-[12px] border-r-[12px] border-b-red-600 border-l-transparent border-r-transparent drop-shadow-md" />
        </div>
      </div>

      {/* Selected Segment Display */}
      <div className="mt-6 text-center">
        <div className="mb-1 text-sm text-gray-600">Currently Selected:</div>
        <div
          className="flex min-h-[3rem] items-center justify-center rounded-lg border-2 px-4 py-2 text-xl font-bold transition-colors duration-200"
          style={{
            backgroundColor: selectedSegment?.color || "#f3f4f6",
            borderColor: selectedSegment?.color || "#d1d5db",
            color: selectedSegment?.color === "#404040" ? "white" : "black",
          }}
        >
          {selectedSegment?.text || "No selection"}
        </div>
      </div>
    </div>
  );
}
