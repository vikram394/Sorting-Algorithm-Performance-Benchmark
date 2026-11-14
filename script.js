/**
 * ============================================================================
 * SORTING ALGORITHM BENCHMARK WEB APP - JAVASCRIPT ENGINE
 * College DAA (Design and Analysis of Algorithms) Mini Project
 * ============================================================================
 * Features:
 *  1. 5 Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick)
 *  2. High-precision benchmarking using window.performance.now()
 *  3. Multiple runs with statistical Median calculation
 *  4. Strict monotonicity assertion (Verification of sorted order)
 *  5. Multi-Algorithm comparative benchmark
 *  6. Interactive Performance Graph on HTML Canvas with auto-scaling
 *  7. Step-by-step sorting visualizer with bar animations
 *  8. Rule-based local DAA Viva Chatbot
 * ============================================================================
 */

// Global constant metadata for the 5 supported algorithms
const ALGORITHMS_META = {
    bubble: {
        name: "Bubble Sort",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        stable: "Yes",
        color: "#10b981", // Emerald Green
        description: "Repeatedly steps through list, compares adjacent elements, and swaps them if out of order."
    },
    selection: {
        name: "Selection Sort",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        stable: "No",
        color: "#f59e0b", // Golden Yellow
        description: "Repeatedly finds minimum element from unsorted part and places it at the beginning."
    },
    insertion: {
        name: "Insertion Sort",
        timeComplexity: "O(N²)",
        spaceComplexity: "O(1)",
        stable: "Yes",
        color: "#f97316", // Vibrant Orange
        description: "Builds sorted array one item at a time by inserting elements into correct position."
    },
    merge: {
        name: "Merge Sort",
        timeComplexity: "O(N log N)",
        spaceComplexity: "O(N)",
        stable: "Yes",
        color: "#06b6d4", // Sky / Cyan
        description: "Divide-and-conquer algorithm that divides array into halves, recursively sorts, and merges."
    },
    quick: {
        name: "Quick Sort",
        timeComplexity: "O(N log N)",
        spaceComplexity: "O(log N)",
        stable: "No",
        color: "#f43f5e", // Coral Red
        description: "Divide-and-conquer algorithm partitioning around a pivot (using middle-pivot Hoare partition)."
    }
};

// ============================================================================
// PART 1: CORE SORTING ALGORITHMS (PURE BENCHMARK IMPLEMENTATIONS)
// ============================================================================

/**
 * 1. Bubble Sort
 * Time: Best O(N), Avg O(N²), Worst O(N²) | Space: O(1)
 */
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // Optimization: if no two elements were swapped, array is already sorted
        if (!swapped) break;
    }
    return arr;
}

/**
 * 2. Selection Sort
 * Time: O(N²) all cases | Space: O(1)
 */
function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            const temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
    return arr;
}

/**
 * 3. Insertion Sort
 * Time: Best O(N), Avg O(N²), Worst O(N²) | Space: O(1)
 */
function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

/**
 * 4. Merge Sort (Recursive Divide & Conquer with Auxiliary Array)
 * Time: O(N log N) all cases | Space: O(N)
 */
function mergeSort(arr) {
    const temp = new Array(arr.length);
    mergeSortHelper(arr, temp, 0, arr.length - 1);
    return arr;
}

function mergeSortHelper(arr, temp, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSortHelper(arr, temp, left, mid);
    mergeSortHelper(arr, temp, mid + 1, right);
    merge(arr, temp, left, mid, right);
}

function merge(arr, temp, left, mid, right) {
    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (let idx = left; idx <= right; idx++) {
        arr[idx] = temp[idx];
    }
}

/**
 * 5. Quick Sort (Hoare Partition Scheme with Middle Element Pivot)
 * Time: Best/Avg O(N log N), Worst O(N²) | Space: O(log N)
 * Using middle pivot avoids recursion depth stack-overflow on sorted/reversed arrays!
 */
function quickSort(arr) {
    quickSortHelper(arr, 0, arr.length - 1);
    return arr;
}

function quickSortHelper(arr, low, high) {
    if (low >= high) return;

    const pivot = arr[Math.floor((low + high) / 2)];
    let i = low;
    let j = high;

    while (i <= j) {
        while (arr[i] < pivot) i++;
        while (arr[j] > pivot) j--;
        if (i <= j) {
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
            j--;
        }
    }

    if (low < j) quickSortHelper(arr, low, j);
    if (i < high) quickSortHelper(arr, i, high);
}

// Function mapper for dynamic invocation
const SORT_FUNCTIONS = {
    bubble: bubbleSort,
    selection: selectionSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort
};

// ============================================================================
// PART 2: ARRAY GENERATION & DATASET UTILITIES
// ============================================================================

/**
 * Generate arrays based on size and selected distribution pattern
 */
function generateInputArray(size, distribution) {
    const arr = new Array(size);

    switch (distribution) {
        case "random":
            for (let i = 0; i < size; i++) {
                arr[i] = Math.floor(Math.random() * size * 10) + 1;
            }
            break;

        case "nearlySorted":
            // Generate ascending sequence 1..N
            for (let i = 0; i < size; i++) {
                arr[i] = i + 1;
            }
            // Swap ~5% of random pairs to make it "nearly sorted"
            const swapCount = Math.max(1, Math.floor(size * 0.05));
            for (let s = 0; s < swapCount; s++) {
                const idx1 = Math.floor(Math.random() * size);
                const idx2 = Math.floor(Math.random() * size);
                const temp = arr[idx1];
                arr[idx1] = arr[idx2];
                arr[idx2] = temp;
            }
            break;

        case "reverse":
            // Strictly descending order N..1
            for (let i = 0; i < size; i++) {
                arr[i] = size - i;
            }
            break;

        case "fewUnique":
            // Values drawn from a tiny set of 5 distinct numbers
            const uniquePool = [10, 25, 50, 75, 100];
            for (let i = 0; i < size; i++) {
                arr[i] = uniquePool[Math.floor(Math.random() * uniquePool.length)];
            }
            break;

        default:
            for (let i = 0; i < size; i++) {
                arr[i] = Math.floor(Math.random() * 1000) + 1;
            }
    }

    return arr;
}

/**
 * Verify whether an array is correctly sorted in non-decreasing order
 */
function verifySorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

/**
 * Calculate statistical Median from an array of measured execution times
 */
function calculateMedian(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    // Sort numbers in ascending order
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 !== 0) {
        return sorted[mid]; // Odd number of runs: exact middle
    } else {
        return (sorted[mid - 1] + sorted[mid]) / 2; // Even number: average of middle two
    }
}

// ============================================================================
// PART 3: BENCHMARK EXECUTION ENGINE
// ============================================================================

// DOM Element references (strictly matching all required HTML IDs)
const algorithmSelect = document.getElementById("algorithmSelect");
const inputSize = document.getElementById("inputSize");
const distributionSelect = document.getElementById("distributionSelect");
const runCount = document.getElementById("runCount");
const benchmarkButton = document.getElementById("benchmarkButton");
const allAlgorithmsButton = document.getElementById("allAlgorithmsButton");
const visualizeButton = document.getElementById("visualizeButton");
const statusElem = document.getElementById("status");
const resultAlgorithm = document.getElementById("resultAlgorithm");
const resultSize = document.getElementById("resultSize");
const resultTime = document.getElementById("resultTime");
const resultTableBody = document.getElementById("resultTableBody");
const benchmarkCanvas = document.getElementById("benchmarkCanvas");
const arrayContainer = document.getElementById("arrayContainer");

// Auxiliary telemetry UI elements
const algoComplexityBadge = document.getElementById("algoComplexityBadge");
const distributionBadge = document.getElementById("distributionBadge");
const runsSummaryBadge = document.getElementById("runsSummaryBadge");
const verificationText = document.getElementById("verificationText");
const runTimesList = document.getElementById("runTimesList");

// Graph data storage: maps algorithm key -> array of { size, time }
let benchmarkGraphData = {
    bubble: [],
    selection: [],
    insertion: [],
    merge: [],
    quick: []
};

/**
 * Run Single Algorithm Benchmark
 */
async function runSingleBenchmark() {
    const algoKey = algorithmSelect.value;
    const size = parseInt(inputSize.value, 10);
    const distribution = distributionSelect.value;
    const runs = parseInt(runCount.value, 10);

    const sortFn = SORT_FUNCTIONS[algoKey];
    const meta = ALGORITHMS_META[algoKey];

    // Update status UI
    setStatus(`Benchmarking ${meta.name} on N=${size} (${distribution}, ${runs} runs)...`, true);
    benchmarkButton.disabled = true;
    allAlgorithmsButton.disabled = true;

    // Let UI refresh status message before synchronous loop starts
    await new Promise(r => setTimeout(r, 20));

    const runTimes = [];
    let isSortedCorrectly = true;

    try {
        for (let r = 0; r < runs; r++) {
            // 1. Generate fresh input array
            const rawArray = generateInputArray(size, distribution);
            // 2. Clone array so sorting is in-place without altering source
            const testArray = [...rawArray];

            // 3. Measure execution time with window.performance.now()
            const t0 = performance.now();
            sortFn(testArray);
            const t1 = performance.now();

            const duration = t1 - t0;
            runTimes.push(duration);

            // 4. Verify output array is actually sorted
            if (!verifySorted(testArray)) {
                isSortedCorrectly = false;
            }
        }

        // 5. Calculate median execution time
        const medianDuration = calculateMedian(runTimes);

        // 6. Display results in Metric Cards
        resultAlgorithm.textContent = meta.name;
        algoComplexityBadge.textContent = `Theoretical: ${meta.timeComplexity}`;

        resultSize.textContent = `${size.toLocaleString()} items`;
        distributionBadge.textContent = `Dist: ${distributionSelect.options[distributionSelect.selectedIndex].text.split(' ')[0]}`;

        resultTime.textContent = `${medianDuration.toFixed(3)} ms`;
        runsSummaryBadge.textContent = `Sample: ${runs} Iterations`;

        // 7. Update verification box
        if (isSortedCorrectly) {
            verificationText.innerHTML = `<span style="color: var(--color-bubble); font-weight: 600;">✓ Verification PASSED:</span> Output is strictly in non-decreasing order across all ${runs} test runs.`;
        } else {
            verificationText.innerHTML = `<span style="color: var(--color-quick); font-weight: 600;">✗ Verification FAILED:</span> Algorithm produced an unsorted sequence!`;
        }

        runTimesList.textContent = runTimes.map((t, idx) => `R${idx + 1}: ${t.toFixed(3)}ms`).join(" | ");

        // Update status
        setStatus(`Benchmark complete. Median: ${medianDuration.toFixed(3)} ms (Verified sorted ✓)`, false);

        // Record data point and update graph
        addPointToGraph(algoKey, size, medianDuration);
        drawPerformanceGraph();

    } catch (error) {
        console.error("Benchmark error:", error);
        setStatus(`Error during benchmark: ${error.message}`, false);
    } finally {
        benchmarkButton.disabled = false;
        allAlgorithmsButton.disabled = false;
    }
}

/**
 * Compare All Algorithms:
 * Evaluates all 5 algorithms against identical generated arrays across sizes: 100, 500, 1000, 2000.
 */
async function compareAllAlgorithms() {
    const comparisonSizes = [100, 500, 1000, 2000];
    const distribution = distributionSelect.value;
    const runs = 3; // 3 runs for fast multi-algorithm batch comparison

    benchmarkButton.disabled = true;
    allAlgorithmsButton.disabled = true;
    setStatus("Starting 'Compare All' suite across 5 algorithms and 4 input sizes...", true);

    // Clear previous graph data
    benchmarkGraphData = {
        bubble: [],
        selection: [],
        insertion: [],
        merge: [],
        quick: []
    };

    const algoKeys = ["bubble", "selection", "insertion", "merge", "quick"];

    try {
        // For each input size
        for (const size of comparisonSizes) {
            setStatus(`Comparing algorithms for N = ${size}...`, true);
            await new Promise(r => setTimeout(r, 20));

            // Generate ONE base array so every algorithm sorts the EXACT SAME DATASET
            const baseArray = generateInputArray(size, distribution);

            // Test each algorithm
            for (const key of algoKeys) {
                const sortFn = SORT_FUNCTIONS[key];
                const times = [];
                let sortedOk = true;

                for (let r = 0; r < runs; r++) {
                    const arrCopy = [...baseArray];
                    const t0 = performance.now();
                    sortFn(arrCopy);
                    const t1 = performance.now();
                    times.push(t1 - t0);

                    if (!verifySorted(arrCopy)) {
                        sortedOk = false;
                    }
                }

                const medianTime = calculateMedian(times);
                benchmarkGraphData[key].push({
                    size,
                    time: medianTime
                });

                // Update table cell
                updateTableCell(key, size, medianTime, sortedOk);
            }

            // Redraw graph incrementally
            drawPerformanceGraph();
        }

        // Highlight the fastest algorithm for each input size column
        for (const size of comparisonSizes) {
            let minTime = Infinity;
            let fastestAlgo = null;
            for (const key of algoKeys) {
                const pt = benchmarkGraphData[key].find(p => p.size === size);
                if (pt && pt.time < minTime) {
                    minTime = pt.time;
                    fastestAlgo = key;
                }
            }
            if (fastestAlgo) {
                const row = resultTableBody.querySelector(`tr[data-algo="${fastestAlgo}"]`);
                const cell = row ? row.querySelector(`.cell-${size}`) : null;
                if (cell) {
                    cell.innerHTML = `<strong style="color: #38bdf8;">${minTime.toFixed(3)}</strong> ms <span style="font-size:0.65rem; color:#34d399; font-weight:700; background:rgba(16,185,129,0.18); padding:1px 5px; border-radius:3px;">⚡ Best</span>`;
                }
            }
        }

        setStatus("Comparative benchmark finished. All 5 algorithms plotted and verified ✓", false);
    } catch (err) {
        console.error("Compare all error:", err);
        setStatus(`Comparative benchmark failed: ${err.message}`, false);
    } finally {
        benchmarkButton.disabled = false;
        allAlgorithmsButton.disabled = false;
    }
}

/**
 * Helper to update individual table cells in Comparative Matrix
 */
function updateTableCell(algoKey, size, timeMs, isSorted) {
    const row = resultTableBody.querySelector(`tr[data-algo="${algoKey}"]`);
    if (!row) return;

    const cell = row.querySelector(`.cell-${size}`);
    if (cell) {
        cell.innerHTML = `<strong>${timeMs.toFixed(3)}</strong> ms`;
    }

    const statusCell = row.querySelector("td:last-child .status-pill");
    if (statusCell) {
        if (isSorted) {
            statusCell.className = "status-pill status-verified";
            statusCell.textContent = "Verified ✓";
        } else {
            statusCell.className = "status-pill";
            statusCell.style.color = "var(--color-quick)";
            statusCell.textContent = "Failed ✗";
        }
    }
}

/**
 * Adds a single benchmark point to graph dataset
 */
function addPointToGraph(algoKey, size, time) {
    const list = benchmarkGraphData[algoKey];
    // Remove existing point for same size if present
    const existingIndex = list.findIndex(p => p.size === size);
    if (existingIndex >= 0) {
        list[existingIndex] = {
            size,
            time
        };
    } else {
        list.push({
            size,
            time
        });
        list.sort((a, b) => a.size - b.size);
    }
}

/**
 * Sets the status bar message and dot state
 */
function setStatus(message, isBusy) {
    if (!statusElem) return;
    statusElem.textContent = message;
    const indicator = document.querySelector(".status-indicator");
    if (indicator) {
        if (isBusy) indicator.classList.add("busy");
        else indicator.classList.remove("busy");
    }
}

// ============================================================================
// PART 4: PERFORMANCE GRAPH ENGINE (HTML CANVAS 2D)
// ============================================================================

// Cached point coordinates for interactive canvas hover tooltips
let renderedPlotPoints = [];
const canvasTooltip = document.getElementById("canvasTooltip");

// Interactive graph states
let isSmoothCurve = true;
let isolatedAlgorithm = null;
let hoveredMousePos = null;

/**
 * Converts a hex color (#10b981) to rgba format with specified alpha
 */
function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Generates smooth Catmull-Rom spline curves through array of {x, y} coordinates
 */
function traceCurvePath(ctx, coords, smooth) {
    if (coords.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);

    if (!smooth || coords.length === 2) {
        for (let i = 1; i < coords.length; i++) {
            ctx.lineTo(coords[i].x, coords[i].y);
        }
    } else {
        for (let i = 0; i < coords.length - 1; i++) {
            const p0 = coords[i === 0 ? i : i - 1];
            const p1 = coords[i];
            const p2 = coords[i + 1];
            const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

            // Convert Catmull-Rom to Cubic Bezier control points
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
    }
}

/**
 * Renders the High-Performance Canvas Graph
 * Features:
 *  - Area fill gradients under curves
 *  - Smooth Catmull-Rom splines
 *  - Multi-ring neon glow data points
 *  - Interactive algorithm isolation on legend click
 *  - Vertical crosshair guide on hover
 *  - High-tech telemetry radar grid in empty state
 */
function drawPerformanceGraph() {
    if (!benchmarkCanvas) return;
    const ctx = benchmarkCanvas.getContext("2d");
    if (!ctx) return;

    renderedPlotPoints = []; // reset cached points for hover detection

    // Setup HiDPI / Retina Sharp Canvas rendering
    const rect = benchmarkCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 980;
    const height = rect.height || 380;

    benchmarkCanvas.width = width * dpr;
    benchmarkCanvas.height = height * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Background Fill with subtle radial vignette
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.7);
    bgGrad.addColorStop(0, "#0e1420");
    bgGrad.addColorStop(1, "#070a10");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Graph Margins & Plotting Bounds
    const margin = {
        top: 35,
        right: 45,
        bottom: 55,
        left: 75
    };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const xCategories = [100, 500, 1000, 2000];

    function getX(size) {
        const idx = xCategories.indexOf(size);
        if (idx !== -1) {
            return margin.left + (idx / (xCategories.length - 1)) * plotWidth;
        }
        const minS = 100;
        const maxS = 2000;
        const norm = Math.max(0, Math.min(1, (size - minS) / (maxS - minS)));
        return margin.left + norm * plotWidth;
    }

    // Find max execution time across all recorded data points
    let maxTime = 1.0;
    let totalPoints = 0;
    for (const key of Object.keys(benchmarkGraphData)) {
        for (const pt of benchmarkGraphData[key]) {
            if (pt.time > maxTime) maxTime = pt.time;
            totalPoints++;
        }
    }
    maxTime = maxTime * 1.15; // 15% headroom

    function getY(time) {
        const norm = time / maxTime;
        return margin.top + plotHeight - norm * plotHeight;
    }

    // Draw Subtle Dashed Grid Lines & Y-Axis Scale
    const yTicks = 5;
    ctx.save();
    ctx.lineWidth = 1;

    for (let i = 0; i <= yTicks; i++) {
        const yVal = (maxTime / yTicks) * i;
        const yPos = getY(yVal);

        // Dashed horizontal grid line
        ctx.strokeStyle = i === 0 ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)";
        ctx.setLineDash(i === 0 ? [] : [3, 4]);
        ctx.beginPath();
        ctx.moveTo(margin.left, yPos);
        ctx.lineTo(margin.left + plotWidth, yPos);
        ctx.stroke();

        // Y-Axis numeric label
        ctx.fillStyle = "#64748b";
        ctx.font = "11px 'Fira Code', monospace";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(yVal.toFixed(2) + " ms", margin.left - 12, yPos);
    }
    ctx.restore();

    // Draw X-Axis Ticks & Labels
    xCategories.forEach(size => {
        const xPos = getX(size);

        // Vertical dashed grid line
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(xPos, margin.top);
        ctx.lineTo(xPos, margin.top + plotHeight);
        ctx.stroke();
        ctx.restore();

        // Small tick mark on X axis
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.moveTo(xPos, margin.top + plotHeight);
        ctx.lineTo(xPos, margin.top + plotHeight + 5);
        ctx.stroke();

        // X-Axis Label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 12px 'Fira Code', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("N=" + size, xPos, margin.top + plotHeight + 10);
    });

    // Draw Main Solid Axis Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.stroke();

    // Axis Titles
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "700 12px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Input Array Size (N Elements)", margin.left + plotWidth / 2, height - 12);

    ctx.save();
    ctx.translate(20, margin.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("Execution Time (milliseconds)", 0, 0);
    ctx.restore();

    // If no data points yet, render High-Tech Laboratory Calibration Grid
    if (totalPoints === 0) {
        ctx.save();
        const centerX = margin.left + plotWidth / 2;
        const centerY = margin.top + plotHeight / 2;

        // Concentric calibration rings
        [50, 95, 140].forEach((r, idx) => {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 - idx * 0.02})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();
        });

        // Crosshairs
        ctx.strokeStyle = "rgba(6, 182, 212, 0.12)";
        ctx.beginPath();
        ctx.moveTo(centerX - 160, centerY);
        ctx.lineTo(centerX + 160, centerY);
        ctx.moveTo(centerX, centerY - 80);
        ctx.lineTo(centerX, centerY + 80);
        ctx.stroke();

        // Glowing Ready Badge
        ctx.fillStyle = "#38bdf8";
        ctx.font = "700 13px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.fillText("TELEMETRY SYSTEM READY // AWAITING BENCHMARK", centerX, centerY - 6);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#64748b";
        ctx.font = "11px 'Fira Code', monospace";
        ctx.fillText("Click 'Compare All' to plot all 5 classical sorting algorithms", centerX, centerY + 18);
        ctx.restore();
        return;
    }

    // Draw Vertical Guideline if mouse is hovering over canvas
    if (hoveredMousePos && hoveredMousePos.x >= margin.left && hoveredMousePos.x <= margin.left + plotWidth) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hoveredMousePos.x, margin.top);
        ctx.lineTo(hoveredMousePos.x, margin.top + plotHeight);
        ctx.stroke();
        ctx.restore();
    }

    // Draw Curves, Area Fills & Glowing Points for each algorithm
    for (const [key, pts] of Object.entries(benchmarkGraphData)) {
        if (!pts || pts.length === 0) continue;

        // Check if algorithm is isolated by legend filter
        const isMuted = isolatedAlgorithm && isolatedAlgorithm !== key;
        const alphaFactor = isMuted ? 0.18 : 1.0;

        const meta = ALGORITHMS_META[key];
        const color = meta.color;
        const sortedPts = [...pts].sort((a, b) => a.size - b.size);

        const coords = sortedPts.map(pt => ({
            x: getX(pt.size),
            y: getY(pt.time),
            size: pt.size,
            time: pt.time
        }));

        if (coords.length >= 2) {
            // 1. Area Glow Gradient under curve
            ctx.save();
            traceCurvePath(ctx, coords, isSmoothCurve);
            ctx.lineTo(coords[coords.length - 1].x, margin.top + plotHeight);
            ctx.lineTo(coords[0].x, margin.top + plotHeight);
            ctx.closePath();

            const areaGrad = ctx.createLinearGradient(0, margin.top, 0, margin.top + plotHeight);
            areaGrad.addColorStop(0, hexToRgba(color, 0.22 * alphaFactor));
            areaGrad.addColorStop(1, hexToRgba(color, 0.005 * alphaFactor));
            ctx.fillStyle = areaGrad;
            ctx.fill();
            ctx.restore();

            // 2. Stroke Curve Line
            ctx.save();
            ctx.strokeStyle = hexToRgba(color, alphaFactor);
            ctx.lineWidth = isMuted ? 1.5 : 3.0;
            if (!isMuted) {
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
            }
            traceCurvePath(ctx, coords, isSmoothCurve);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Draw Multi-Layer Glowing Data Points
        coords.forEach(pt => {
            // Record coordinates for mouse hover tooltip
            renderedPlotPoints.push({
                algoKey: key,
                size: pt.size,
                time: pt.time,
                px: pt.x,
                py: pt.y,
                color
            });

            if (isMuted) {
                ctx.save();
                ctx.fillStyle = hexToRgba(color, 0.3);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                return;
            }

            ctx.save();
            // Outer Halo Ring
            ctx.fillStyle = hexToRgba(color, 0.25);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 9, 0, Math.PI * 2);
            ctx.fill();

            // Middle Vibrant Glow Circle
            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Inner White Center Core
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Crisp numeric runtime pill above point
            ctx.save();
            ctx.fillStyle = color;
            ctx.font = "700 10px 'Fira Code', monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${pt.time.toFixed(2)}ms`, pt.x, pt.y - 11);
            ctx.restore();
        });
    }
}

// Canvas Mouse Move: Show Interactive Data Tooltip & Guideline
if (benchmarkCanvas) {
    benchmarkCanvas.addEventListener("mousemove", (e) => {
        if (!canvasTooltip) return;
        const rect = benchmarkCanvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        hoveredMousePos = {
            x: mouseX,
            y: mouseY
        };

        let closest = null;
        let minDist = 22; // 22px hover sensitivity

        for (const p of renderedPlotPoints) {
            const dist = Math.hypot(p.px - mouseX, p.py - mouseY);
            if (dist < minDist) {
                minDist = dist;
                closest = p;
            }
        }

        if (closest) {
            const meta = ALGORITHMS_META[closest.algoKey];
            canvasTooltip.innerHTML = `
        <div style="font-weight: 800; color: ${closest.color}; font-size: 0.82rem; margin-bottom: 3px;">${meta.name}</div>
        <div style="color: #94a3b8; font-size: 0.72rem;">Input Array Size: <strong style="color: #ffffff;">N = ${closest.size}</strong></div>
        <div style="color: #cbd5e1; font-size: 0.76rem;">Median Execution: <strong style="color: #38bdf8; font-size: 0.82rem;">${closest.time.toFixed(3)} ms</strong></div>
      `;
            canvasTooltip.style.display = "block";
            canvasTooltip.style.left = `${closest.px}px`;
            canvasTooltip.style.top = `${closest.py}px`;
        } else {
            canvasTooltip.style.display = "none";
        }
    });

    benchmarkCanvas.addEventListener("mouseleave", () => {
        hoveredMousePos = null;
        if (canvasTooltip) canvasTooltip.style.display = "none";
        drawPerformanceGraph();
    });
}

// Redraw graph when window resizes
window.addEventListener("resize", () => {
    drawPerformanceGraph();
});

// ============================================================================
// PART 5: STEP-BY-STEP SORTING VISUALIZATION ENGINE
// ============================================================================

const VIZ_ELEMENT_COUNT = 32;
let vizArray = [];
let isVisualizing = false;
let vizCancelToken = {
    cancelled: false
};

// UI Elements for visualizer telemetry
const vizComparisons = document.getElementById("vizComparisons");
const vizSwaps = document.getElementById("vizSwaps");
const vizPhase = document.getElementById("vizPhase");
const vizSpeedRange = document.getElementById("vizSpeedRange");
const resetVizButton = document.getElementById("resetVizButton");

/**
 * Initialize or reset the visualization dataset
 */
function resetVisualizationArray() {
    // Cancel any running animation
    vizCancelToken.cancelled = true;
    vizCancelToken = {
        cancelled: false
    };
    isVisualizing = false;

    vizArray = [];
    // Generate random heights between 15 and 100
    for (let i = 0; i < VIZ_ELEMENT_COUNT; i++) {
        vizArray.push(Math.floor(Math.random() * 85) + 15);
    }

    // Render DOM bars
    renderVisualizerBars();

    if (vizComparisons) vizComparisons.textContent = "0";
    if (vizSwaps) vizSwaps.textContent = "0";
    if (vizPhase) vizPhase.textContent = "Array initialized. Ready.";
}

/**
 * Render array values as vertical bar elements in #arrayContainer
 */
function renderVisualizerBars() {
    if (!arrayContainer) return;
    arrayContainer.innerHTML = "";

    for (let i = 0; i < vizArray.length; i++) {
        const val = vizArray[i];
        const bar = document.createElement("div");
        bar.className = "array-bar";
        bar.id = `bar-${i}`;
        bar.style.height = `${val}%`;

        const span = document.createElement("span");
        span.className = "bar-val";
        span.textContent = val;
        bar.appendChild(span);

        arrayContainer.appendChild(bar);
    }
}

/**
 * Sleep helper based on user speed slider
 */
function sleepAnimation() {
    const delay = vizSpeedRange ? parseInt(vizSpeedRange.value, 10) : 40;
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Helper to update bar style classes
 */
function setBarState(index, stateClass) {
    const bar = document.getElementById(`bar-${index}`);
    if (!bar) return;
    bar.className = "array-bar";
    if (stateClass) {
        bar.classList.add(stateClass);
    }
}

/**
 * Update height and text of a bar
 */
function updateBarHeight(index, value) {
    const bar = document.getElementById(`bar-${index}`);
    if (!bar) return;
    bar.style.height = `${value}%`;
    const span = bar.querySelector(".bar-val");
    if (span) span.textContent = value;
}

/**
 * Master Visualization Dispatcher
 */
async function startVisualization() {
    if (isVisualizing) {
        // If already running, cancel previous run and restart fresh
        vizCancelToken.cancelled = true;
        await new Promise(r => setTimeout(r, 60));
    }

    vizCancelToken = {
        cancelled: false
    };
    const token = vizCancelToken;
    isVisualizing = true;

    const algoKey = algorithmSelect.value;
    const meta = ALGORITHMS_META[algoKey];

    if (vizPhase) vizPhase.textContent = `Running ${meta.name}...`;

    let comparisons = 0;
    let swaps = 0;

    function incComp() {
        comparisons++;
        if (vizComparisons) vizComparisons.textContent = comparisons;
    }

    function incSwap() {
        swaps++;
        if (vizSwaps) vizSwaps.textContent = swaps;
    }

    try {
        switch (algoKey) {
            case "bubble":
                await visualizeBubbleSort(token, incComp, incSwap);
                break;
            case "selection":
                await visualizeSelectionSort(token, incComp, incSwap);
                break;
            case "insertion":
                await visualizeInsertionSort(token, incComp, incSwap);
                break;
            case "merge":
                await visualizeMergeSort(token, incComp, incSwap);
                break;
            case "quick":
                await visualizeQuickSort(token, incComp, incSwap);
                break;
        }

        if (!token.cancelled) {
            // Mark all bars as sorted (Emerald Green)
            for (let i = 0; i < vizArray.length; i++) {
                setBarState(i, "state-sorted");
            }
            if (vizPhase) vizPhase.textContent = "Visualization Completed! Output verified sorted ✓";
        }
    } catch (e) {
        console.error("Visualization error:", e);
    } finally {
        if (token === vizCancelToken) {
            isVisualizing = false;
        }
    }
}

/* --- 1. Bubble Sort Visualizer --- */
async function visualizeBubbleSort(token, incComp, incSwap) {
    const n = vizArray.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (token.cancelled) return;

            // Comparing (Golden Yellow)
            setBarState(j, "state-compare");
            setBarState(j + 1, "state-compare");
            incComp();
            await sleepAnimation();

            if (vizArray[j] > vizArray[j + 1]) {
                // Swapping (Coral Red)
                setBarState(j, "state-swap");
                setBarState(j + 1, "state-swap");
                incSwap();

                const temp = vizArray[j];
                vizArray[j] = vizArray[j + 1];
                vizArray[j + 1] = temp;

                updateBarHeight(j, vizArray[j]);
                updateBarHeight(j + 1, vizArray[j + 1]);
                await sleepAnimation();
            }

            setBarState(j, null);
            setBarState(j + 1, null);
        }
        // Sorted position at end (Emerald Green)
        setBarState(n - i - 1, "state-sorted");
    }
    setBarState(0, "state-sorted");
}

/* --- 2. Selection Sort Visualizer --- */
async function visualizeSelectionSort(token, incComp, incSwap) {
    const n = vizArray.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        setBarState(minIdx, "state-compare");

        for (let j = i + 1; j < n; j++) {
            if (token.cancelled) return;

            setBarState(j, "state-compare");
            incComp();
            await sleepAnimation();

            if (vizArray[j] < vizArray[minIdx]) {
                if (minIdx !== i) setBarState(minIdx, null);
                minIdx = j;
                setBarState(minIdx, "state-compare");
            } else {
                setBarState(j, null);
            }
        }

        if (minIdx !== i) {
            // Swapping (Coral Red)
            setBarState(i, "state-swap");
            setBarState(minIdx, "state-swap");
            incSwap();

            const temp = vizArray[i];
            vizArray[i] = vizArray[minIdx];
            vizArray[minIdx] = temp;

            updateBarHeight(i, vizArray[i]);
            updateBarHeight(minIdx, vizArray[minIdx]);
            await sleepAnimation();
            setBarState(minIdx, null);
        }

        setBarState(i, "state-sorted");
    }
    setBarState(n - 1, "state-sorted");
}

/* --- 3. Insertion Sort Visualizer --- */
async function visualizeInsertionSort(token, incComp, incSwap) {
    const n = vizArray.length;
    setBarState(0, "state-sorted");

    for (let i = 1; i < n; i++) {
        const key = vizArray[i];
        let j = i - 1;

        setBarState(i, "state-compare");
        await sleepAnimation();

        while (j >= 0 && vizArray[j] > key) {
            if (token.cancelled) return;
            incComp();

            setBarState(j, "state-swap");
            setBarState(j + 1, "state-swap");
            incSwap();

            vizArray[j + 1] = vizArray[j];
            updateBarHeight(j + 1, vizArray[j + 1]);
            await sleepAnimation();

            setBarState(j + 1, "state-sorted");
            j--;
        }
        if (j >= 0) incComp();

        vizArray[j + 1] = key;
        updateBarHeight(j + 1, key);
        incSwap();

        for (let k = 0; k <= i; k++) {
            setBarState(k, "state-sorted");
        }
    }
}

/* --- 4. Merge Sort Visualizer --- */
async function visualizeMergeSort(token, incComp, incSwap) {
    await mergeSortVizHelper(0, vizArray.length - 1, token, incComp, incSwap);
}

async function mergeSortVizHelper(left, right, token, incComp, incSwap) {
    if (left >= right || token.cancelled) return;

    const mid = Math.floor((left + right) / 2);
    await mergeSortVizHelper(left, mid, token, incComp, incSwap);
    await mergeSortVizHelper(mid + 1, right, token, incComp, incSwap);
    await mergeViz(left, mid, right, token, incComp, incSwap);
}

async function mergeViz(left, mid, right, token, incComp, incSwap) {
    const merged = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
        if (token.cancelled) return;
        setBarState(i, "state-compare");
        setBarState(j, "state-compare");
        incComp();
        await sleepAnimation();

        if (vizArray[i] <= vizArray[j]) {
            merged.push(vizArray[i]);
            setBarState(i, null);
            i++;
        } else {
            merged.push(vizArray[j]);
            setBarState(j, null);
            j++;
        }
    }

    while (i <= mid) {
        merged.push(vizArray[i]);
        i++;
    }
    while (j <= right) {
        merged.push(vizArray[j]);
        j++;
    }

    // Write merged values back into vizArray
    for (let k = 0; k < merged.length; k++) {
        if (token.cancelled) return;
        const targetIdx = left + k;
        vizArray[targetIdx] = merged[k];
        updateBarHeight(targetIdx, merged[k]);
        setBarState(targetIdx, "state-swap");
        incSwap();
        await sleepAnimation();
        setBarState(targetIdx, null);
    }
}

/* --- 5. Quick Sort Visualizer --- */
async function visualizeQuickSort(token, incComp, incSwap) {
    await quickSortVizHelper(0, vizArray.length - 1, token, incComp, incSwap);
}

async function quickSortVizHelper(low, high, token, incComp, incSwap) {
    if (low >= high || token.cancelled) {
        if (low >= 0 && low < vizArray.length) setBarState(low, "state-sorted");
        return;
    }

    const pivotIdx = Math.floor((low + high) / 2);
    const pivotVal = vizArray[pivotIdx];
    let i = low;
    let j = high;

    setBarState(pivotIdx, "state-compare");

    while (i <= j) {
        if (token.cancelled) return;

        while (vizArray[i] < pivotVal) {
            incComp();
            setBarState(i, "state-compare");
            await sleepAnimation();
            setBarState(i, null);
            i++;
        }
        incComp();

        while (vizArray[j] > pivotVal) {
            incComp();
            setBarState(j, "state-compare");
            await sleepAnimation();
            setBarState(j, null);
            j--;
        }
        incComp();

        if (i <= j) {
            setBarState(i, "state-swap");
            setBarState(j, "state-swap");
            incSwap();

            const temp = vizArray[i];
            vizArray[i] = vizArray[j];
            vizArray[j] = temp;

            updateBarHeight(i, vizArray[i]);
            updateBarHeight(j, vizArray[j]);
            await sleepAnimation();

            setBarState(i, null);
            setBarState(j, null);
            i++;
            j--;
        }
    }

    if (low < j) await quickSortVizHelper(low, j, token, incComp, incSwap);
    if (i < high) await quickSortVizHelper(i, high, token, incComp, incSwap);

    for (let k = low; k <= high; k++) {
        setBarState(k, "state-sorted");
    }
}

// ============================================================================
// PART 6: RULE-BASED LOCAL DAA VIVA CHATBOT
// ============================================================================

const chatbotButton = document.getElementById("chatbotButton");
const chatbotBox = document.getElementById("chatbotBox");
const closeChatbot = document.getElementById("closeChatbot");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotInput = document.getElementById("chatbotInput");
const sendChatbot = document.getElementById("sendChatbot");

// Knowledge base for rule-based matching covering all 24 required topics
const CHATBOT_KNOWLEDGE = [{
        keywords: ["what is this project", "project overview", "about project", "mini project"],
        topic: "Project",
        reply: `<strong>Project Title:</strong> Sorting Algorithm Benchmark Web App.<br>
    It is a Design and Analysis of Algorithms (DAA) laboratory tool created to empirically evaluate, plot, and visually animate classical sorting algorithms across diverse dataset distributions.`
    },
    {
        keywords: ["objective", "goal", "purpose", "aim"],
        topic: "Objective",
        reply: `<strong>Primary Objective:</strong><br>
    1. Measure empirical runtimes using <code>window.performance.now()</code>.<br>
    2. Compute statistical <strong>Median</strong> across odd iterations to eliminate operating system scheduling jitter.<br>
    3. Plot empirical scaling curves to validate theoretical <code>O(N log N)</code> vs <code>O(N²)</code> Big-O bounds.<br>
    4. Provide step-by-step visual animation of comparisons and swaps.`
    },
    {
        keywords: ["bubble sort", "bubble"],
        topic: "Bubble Sort",
        reply: `<strong>Bubble Sort:</strong><br>
    &bull; <strong>Time Complexity:</strong> Best: <code>O(N)</code> (when sorted with early stop), Avg: <code>O(N²)</code>, Worst: <code>O(N²)</code>.<br>
    &bull; <strong>Space:</strong> <code>O(1)</code> (In-place).<br>
    &bull; <strong>Stability:</strong> Stable.<br>
    &bull; <strong>Mechanism:</strong> Iteratively steps through array, compares adjacent pairs, and bubbles the largest element to the end.`
    },
    {
        keywords: ["selection sort", "selection"],
        topic: "Selection Sort",
        reply: `<strong>Selection Sort:</strong><br>
    &bull; <strong>Time Complexity:</strong> Best, Avg, Worst: <code>O(N²)</code> (Always scans entire unsorted prefix).<br>
    &bull; <strong>Space:</strong> <code>O(1)</code> (In-place).<br>
    &bull; <strong>Stability:</strong> Unstable (swapping can reverse order of equal keys).<br>
    &bull; <strong>Mechanism:</strong> Locates minimum value in unsorted subarray and swaps it to current frontier.`
    },
    {
        keywords: ["insertion sort", "insertion"],
        topic: "Insertion Sort",
        reply: `<strong>Insertion Sort:</strong><br>
    &bull; <strong>Time Complexity:</strong> Best: <code>O(N)</code> (nearly sorted), Avg/Worst: <code>O(N²)</code>.<br>
    &bull; <strong>Space:</strong> <code>O(1)</code> (In-place).<br>
    &bull; <strong>Stability:</strong> Stable.<br>
    &bull; <strong>Mechanism:</strong> Inserts each element into its proper position within the already sorted prefix, similar to sorting playing cards.`
    },
    {
        keywords: ["merge sort", "merge"],
        topic: "Merge Sort",
        reply: `<strong>Merge Sort:</strong><br>
    &bull; <strong>Time Complexity:</strong> Guaranteed <code>O(N log N)</code> in Best, Average, and Worst cases.<br>
    &bull; <strong>Space:</strong> <code>O(N)</code> auxiliary array memory.<br>
    &bull; <strong>Stability:</strong> Stable.<br>
    &bull; <strong>Mechanism:</strong> Divide-and-Conquer paradigm. Divides list into two halves recursively until singletons, then merges ordered sublists.`
    },
    {
        keywords: ["quick sort", "quick"],
        topic: "Quick Sort",
        reply: `<strong>Quick Sort:</strong><br>
    &bull; <strong>Time Complexity:</strong> Best/Avg: <code>O(N log N)</code>, Worst: <code>O(N²)</code> (if poor pivot choice).<br>
    &bull; <strong>Space:</strong> <code>O(log N)</code> recursion stack.<br>
    &bull; <strong>Stability:</strong> Unstable.<br>
    &bull; <strong>Optimization:</strong> This lab uses <em>Hoare partition with middle element pivot</em>, avoiding stack-overflow and <code>O(N²)</code> degradation on reverse/sorted arrays.`
    },
    {
        keywords: ["time complexity", "big o", "complexity"],
        topic: "Time Complexity",
        reply: `<strong>Time Complexity Summary:</strong><br>
    &bull; <strong>Merge Sort:</strong> <code>O(N log N)</code> all cases.<br>
    &bull; <strong>Quick Sort:</strong> <code>O(N log N)</code> avg, <code>O(N²)</code> worst.<br>
    &bull; <strong>Insertion Sort:</strong> <code>O(N)</code> best, <code>O(N²)</code> avg/worst.<br>
    &bull; <strong>Bubble Sort:</strong> <code>O(N)</code> best, <code>O(N²)</code> avg/worst.<br>
    &bull; <strong>Selection Sort:</strong> <code>O(N²)</code> all cases.`
    },
    {
        keywords: ["space complexity", "auxiliary space", "memory"],
        topic: "Space Complexity",
        reply: `<strong>Space Complexity Analysis:</strong><br>
    &bull; <strong>Bubble, Selection, Insertion:</strong> <code>O(1)</code> auxiliary (in-place).<br>
    &bull; <strong>Quick Sort:</strong> <code>O(log N)</code> call stack frames.<br>
    &bull; <strong>Merge Sort:</strong> <code>O(N)</code> auxiliary buffer needed during the merge step.`
    },
    {
        keywords: ["stable", "stability"],
        topic: "Stable Sorting",
        reply: `<strong>What is Algorithm Stability?</strong><br>
    A sorting algorithm is <em>stable</em> if two objects with equal keys appear in the same relative order in the sorted output as they were in the input.<br>
    &bull; <strong>Stable:</strong> Bubble Sort, Insertion Sort, Merge Sort.<br>
    &bull; <strong>Unstable:</strong> Selection Sort, Quick Sort.`
    },
    {
        keywords: ["divide and conquer", "d&c"],
        topic: "Divide and Conquer",
        reply: `<strong>Divide and Conquer Paradigm:</strong><br>
    Consists of three phases:<br>
    1. <strong>Divide:</strong> Partition problem into smaller subproblems (e.g. halves in Merge Sort).<br>
    2. <strong>Conquer:</strong> Solve subproblems recursively.<br>
    3. <strong>Combine:</strong> Merge sub-solutions into the final sorted array.`
    },
    {
        keywords: ["performance.now()", "high resolution", "timer"],
        topic: "performance.now()",
        reply: `<strong>Why performance.now()?</strong><br>
    Unlike <code>Date.now()</code> (which has 1ms resolution and fluctuates with system clock updates), <code>performance.now()</code> provides a monotonically increasing timestamp measured in fractions of a millisecond (microsecond precision, ~0.001 ms).`
    },
    {
        keywords: ["median", "why median", "average vs median"],
        topic: "Median",
        reply: `<strong>Why Median instead of Mean?</strong><br>
    Modern multitasking operating systems run background tasks (garbage collection, CPU throttling, OS interrupts). The <strong>Median</strong> of odd runs (3, 5, 7) is statistically robust and filters out extreme outlier spikes that would skew the arithmetic mean.`
    },
    {
        keywords: ["input size", "n="],
        topic: "Input Size",
        reply: `<strong>Input Sizes Used:</strong><br>
    Tested across 100, 500, 1000, 2000, and 5000 elements. As N increases, the quadratic growth rate of <code>O(N²)</code> algorithms diverges sharply from the linearithmic growth of <code>O(N log N)</code> algorithms.`
    },
    {
        keywords: ["distribution", "nearly sorted", "reverse sorted", "few unique"],
        topic: "Input Distributions",
        reply: `<strong>Input Distributions:</strong><br>
    &bull; <strong>Random:</strong> Uniform distribution.<br>
    &bull; <strong>Nearly Sorted:</strong> ~95% in order; tests Insertion Sort's near-linear <code>O(N)</code> performance.<br>
    &bull; <strong>Reverse Sorted:</strong> Worst-case input for standard Bubble & Insertion sorts.<br>
    &bull; <strong>Few Unique Values:</strong> Large number of duplicate elements.`
    },
    {
        keywords: ["graph", "plot", "canvas"],
        topic: "Graph",
        reply: `<strong>What Does the Graph Show?</strong><br>
    X-axis = Input Size (N), Y-axis = Execution Time (ms).<br>
    The parabolic curves demonstrate <code>O(N²)</code> complexity (Bubble, Selection, Insertion), whereas Merge and Quick Sort remain flat near the bottom with gentle <code>O(N log N)</code> scaling.`
    },
    {
        keywords: ["visualization", "visualizer", "how visualization works"],
        topic: "Visualization",
        reply: `<strong>How Visualization Works:</strong><br>
    Renders 32 vertical bars corresponding to array heights. Uses asynchronous JavaScript (<code>async/await</code> with dynamic sleep delays) to animate comparisons (<span style="color: var(--color-selection);">Golden Yellow</span>), swaps (<span style="color: var(--color-quick);">Coral Red</span>), and sorted partitions (<span style="color: var(--color-bubble);">Emerald Green</span>).`
    },
    {
        keywords: ["why javascript", "technology"],
        topic: "Why JavaScript",
        reply: `<strong>Why Vanilla JavaScript?</strong><br>
    1. Zero installation or compilation overhead — runs directly in any modern browser.<br>
    2. Access to <code>performance.now()</code> and the native HTML5 Canvas API.<br>
    3. Easy to explain in a viva without complex framework abstractions.`
    },
    {
        keywords: ["benchmarking", "benchmark methodology", "how benchmark works"],
        topic: "Benchmarking",
        reply: `<strong>Benchmarking Methodology:</strong><br>
    1. Clone array to ensure algorithm operates in-place on unaffected identical data.<br>
    2. Capture timestamp using <code>performance.now()</code> before and after execution.<br>
    3. Repeat benchmark over 3, 5, or 7 iterations.<br>
    4. Compute <strong>Median</strong> runtime to discard OS context switches and jitter.<br>
    5. Formally verify sorted order (monotonicity assertion).`
    },
    {
        keywords: ["why compare", "why compare algorithms", "comparison"],
        topic: "Why Compare Algorithms?",
        reply: `<strong>Why Compare Algorithms?</strong><br>
    Theoretical asymptotic Big-O bounds describe asymptotic growth, but practical runtime also depends on constant factors, memory cache locality, and input distributions (e.g., Insertion Sort outperforms Quick Sort on nearly-sorted data). Empirical comparison verifies theory against real hardware execution.`
    },
    {
        keywords: ["advantages", "advantage", "strengths", "pros"],
        topic: "Advantages",
        reply: `<strong>Project Advantages:</strong><br>
    &bull; Zero dependencies (Pure Vanilla JS, HTML5, CSS3).<br>
    &bull; Microsecond-level timer precision (<code>performance.now()</code>).<br>
    &bull; Statistical outlier filtration via odd-sample Median.<br>
    &bull; Verification assertion guaranteeing correctness of output arrays.<br>
    &bull; Synchronized visual comparison of <code>O(N²)</code> vs <code>O(N log N)</code>.`
    },
    {
        keywords: ["limitations", "limitation", "drawbacks", "cons"],
        topic: "Limitations",
        reply: `<strong>Project Limitations:</strong><br>
    &bull; Single-threaded browser runtime: large inputs (&gt;10,000) on <code>O(N²)</code> algorithms can momentarily block the UI thread.<br>
    &bull; JIT compiler optimizations in V8 may perform loop unrolling or inline caching, slightly altering raw operational counts.`
    },
    {
        keywords: ["future improvements", "future scope", "improvements", "enhancements"],
        topic: "Future Improvements",
        reply: `<strong>Future Scope & Improvements:</strong><br>
    &bull; Run benchmarks inside dedicated <strong>Web Workers</strong> to avoid blocking UI during intensive runs.<br>
    &bull; Support export of benchmark dataset as CSV or JSON reports.<br>
    &bull; Add memory allocation telemetry using browser heap performance APIs.`
    },
    {
        keywords: ["viva", "viva questions", "questions"],
        topic: "Viva",
        reply: `<strong>Top DAA Viva Questions & Answers:</strong><br>
    <strong>Q1: Why is Quick Sort preferred over Merge Sort for arrays?</strong><br>
    A: Quick Sort is in-place (low cache misses, <code>O(log N)</code> stack), whereas Merge Sort requires <code>O(N)</code> auxiliary array allocation.<br><br>
    <strong>Q2: When is Insertion Sort fastest?</strong><br>
    A: On nearly-sorted or small arrays (runs in <code>O(N)</code> with low constant factor).<br><br>
    <strong>Q3: What causes Quick Sort worst-case?</strong><br>
    A: Extreme unbalanced partitions when pivot is always min/max (mitigated by our middle-pivot selection).`
    }
];

/**
 * Open Chatbot
 */
function openChatbot() {
    if (chatbotBox) {
        chatbotBox.classList.add("is-open");
        if (chatbotInput) chatbotInput.focus();
    }
}

/**
 * Close Chatbot
 */
function hideChatbot() {
    if (chatbotBox) {
        chatbotBox.classList.remove("is-open");
    }
}

/**
 * Append message bubble to chat window
 */
function appendChatMessage(htmlText, isBot = true) {
    if (!chatbotMessages) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-message ${isBot ? "bot-msg" : "user-msg"}`;

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = htmlText;

    const timeSpan = document.createElement("span");
    timeSpan.className = "msg-time";
    timeSpan.textContent = "Just now";

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(timeSpan);
    chatbotMessages.appendChild(msgDiv);

    // Auto-scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/**
 * Find matched rule from query
 */
function queryChatbotKnowledge(userQuery) {
    const clean = userQuery.toLowerCase().trim();

    // Search through defined knowledge base
    for (const item of CHATBOT_KNOWLEDGE) {
        for (const kw of item.keywords) {
            if (clean.includes(kw)) {
                return item.reply;
            }
        }
    }

    // Fallback answer
    return `I am familiar with DAA concepts including <strong>Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort</strong>, Big-O complexities, stability, median calculation, and viva preparation.<br><br>Try asking: <em>"Explain Merge Sort"</em>, <em>"Why use median?"</em>, or click the chips above!`;
}

/**
 * Handle sending a user chat message
 */
function handleChatSubmit() {
    if (!chatbotInput) return;
    const text = chatbotInput.value.trim();
    if (!text) return;

    appendChatMessage(escapeHtml(text), false);
    chatbotInput.value = "";

    setTimeout(() => {
        const answer = queryChatbotKnowledge(text);
        appendChatMessage(answer, true);
    }, 180);
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ============================================================================
// PART 7: EVENT LISTENERS & INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial visualizer array setup
    resetVisualizationArray();

    // 2. Initial empty canvas grid draw
    drawPerformanceGraph();

    // 3. Benchmark button events
    if (benchmarkButton) {
        benchmarkButton.addEventListener("click", runSingleBenchmark);
    }

    if (allAlgorithmsButton) {
        allAlgorithmsButton.addEventListener("click", compareAllAlgorithms);
    }

    // 4. Visualization button events
    if (visualizeButton) {
        visualizeButton.addEventListener("click", startVisualization);
    }

    if (resetVizButton) {
        resetVizButton.addEventListener("click", resetVisualizationArray);
    }

    // 5. Algorithm selector change updates result card preview
    if (algorithmSelect) {
        algorithmSelect.addEventListener("change", () => {
            const meta = ALGORITHMS_META[algorithmSelect.value];
            if (resultAlgorithm) resultAlgorithm.textContent = meta.name;
            if (algoComplexityBadge) algoComplexityBadge.textContent = `Theoretical: ${meta.timeComplexity}`;
        });
    }

    // 6. Chatbot Widget Events (Strictly CLOSED by default)
    if (chatbotButton) {
        chatbotButton.addEventListener("click", openChatbot);
    }

    if (closeChatbot) {
        closeChatbot.addEventListener("click", hideChatbot);
    }

    if (sendChatbot) {
        sendChatbot.addEventListener("click", handleChatSubmit);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleChatSubmit();
            }
        });
    }

    // Chatbot quick suggestion chips
    const chipButtons = document.querySelectorAll(".chip-btn");
    chipButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const topic = btn.getAttribute("data-topic");
            if (topic) {
                appendChatMessage(`Tell me about: ${topic}`, false);
                setTimeout(() => {
                    const answer = queryChatbotKnowledge(topic.toLowerCase());
                    appendChatMessage(answer, true);
                }, 150);
            }
        });
    });

    // 7. Graph Utility Toolbar & Legend Interactions
    const toggleCurveBtn = document.getElementById("toggleCurveBtn");
    if (toggleCurveBtn) {
        toggleCurveBtn.addEventListener("click", () => {
            isSmoothCurve = !isSmoothCurve;
            const span = toggleCurveBtn.querySelector("span");
            if (span) span.textContent = `Curve: ${isSmoothCurve ? "Smooth" : "Linear"}`;
            drawPerformanceGraph();
        });
    }

    const downloadGraphBtn = document.getElementById("downloadGraphBtn");
    if (downloadGraphBtn && benchmarkCanvas) {
        downloadGraphBtn.addEventListener("click", () => {
            const link = document.createElement("a");
            link.download = `sorting-benchmark-analysis-${Date.now()}.png`;
            link.href = benchmarkCanvas.toDataURL("image/png");
            link.click();
        });
    }

    // Legend Items Click: Isolate or restore algorithm on the performance graph
    const legendItems = document.querySelectorAll(".legend-item");
    legendItems.forEach(item => {
        item.addEventListener("click", () => {
            const algo = item.getAttribute("data-algo");
            if (isolatedAlgorithm === algo) {
                isolatedAlgorithm = null;
                legendItems.forEach(li => li.classList.remove("is-dimmed"));
            } else {
                isolatedAlgorithm = algo;
                legendItems.forEach(li => {
                    if (li.getAttribute("data-algo") === algo) {
                        li.classList.remove("is-dimmed");
                    } else {
                        li.classList.add("is-dimmed");
                    }
                });
            }
            drawPerformanceGraph();
        });
    });
});