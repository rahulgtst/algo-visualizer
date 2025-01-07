// Initialize default values
const generateButton = document.getElementById("generate");
const startButton = document.getElementById("start");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const arrayContainer = document.getElementById("arrayContainer");
const algorithmSelect = document.getElementById("algorithm");

// Settings
let array = [];
let barElements = [];
let isSorting = false;
let speed = 10; // Speed factor

// Update the speed value displayed
speedInput.addEventListener("input", () => {
    speed = speedInput.value;
    speedValue.textContent = speed;
});

// Generate a random array
generateButton.addEventListener("click", () => {
    if (isSorting) return; // Disable generate while sorting
    array = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1);
    renderArray();
});

// Render the array as bars
function renderArray() {
    arrayContainer.innerHTML = '';
    barElements = array.map((value) => {
        const bar = document.createElement("div");
        bar.style.height = `${value * 3}px`; // Scale for visibility
        bar.classList.add("bar");
        arrayContainer.appendChild(bar);
        return bar;
    });
}

// Swap two elements and update the bars
function swap(index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
    const temp = barElements[index1].style.height;
    barElements[index1].style.height = barElements[index2].style.height;
    barElements[index2].style.height = temp;
}

// Sorting Algorithms

async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {
            barElements[j].style.backgroundColor = "#e74c3c"; // Mark as compared
            barElements[j + 1].style.backgroundColor = "#e74c3c";
            await new Promise(resolve => setTimeout(resolve, 100 / speed));
            if (array[j] > array[j + 1]) {
                swap(j, j + 1);
            }
            barElements[j].style.backgroundColor = "#3498db"; // Reset color
            barElements[j + 1].style.backgroundColor = "#3498db";
        }
    }
    markSorted();
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        barElements[i].style.backgroundColor = "#e74c3c"; // Mark current element
        await new Promise(resolve => setTimeout(resolve, 100 / speed));
        while (j >= 0 && array[j] > key) {
            barElements[j].style.backgroundColor = "#e74c3c"; // Mark as compared
            swap(j + 1, j);
            await new Promise(resolve => setTimeout(resolve, 100 / speed));
            j--;
        }
        array[j + 1] = key;
        barElements[i].style.backgroundColor = "#3498db"; // Reset color
    }
    markSorted();
}

async function selectionSort() {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        barElements[i].style.backgroundColor = "#e74c3c"; // Mark current element
        for (let j = i + 1; j < array.length; j++) {
            barElements[j].style.backgroundColor = "#e74c3c"; // Mark as compared
            await new Promise(resolve => setTimeout(resolve, 100 / speed));
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            barElements[j].style.backgroundColor = "#3498db"; // Reset color
        }
        if (minIndex !== i) {
            swap(i, minIndex);
        }
        barElements[i].style.backgroundColor = "#3498db"; // Reset color
    }
    markSorted();
}

async function quickSort() {
    // Implementation of Quick Sort (recursive)
    async function partition(low, high) {
        let pivot = array[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (array[j] < pivot) {
                i++;
                swap(i, j);
            }
            await new Promise(resolve => setTimeout(resolve, 100 / speed));
        }
        swap(i + 1, high);
        return i + 1;
    }

    async function quickSortRecursive(low, high) {
        if (low < high) {
            let pi = await partition(low, high);
            await quickSortRecursive(low, pi - 1);
            await quickSortRecursive(pi + 1, high);
        }
    }

    await quickSortRecursive(0, array.length - 1);
    markSorted();
}

async function mergeSort() {
    // Merge Sort logic (recursive)
    async function merge(left, right) {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex] < right[rightIndex]) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)];
    }

    async function mergeSortRecursive(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        const middle = Math.floor(arr.length / 2);
        const left = arr.slice(0, middle);
        const right = arr.slice(middle);
        const merged = await merge(mergeSortRecursive(left), mergeSortRecursive(right));
        return merged;
    }

    array = await mergeSortRecursive(array);
    renderArray();
    markSorted();
}

// Helper to mark array as sorted
function markSorted() {
    barElements.forEach(bar => bar.style.backgroundColor = "#2ecc71"); // Green for sorted
    isSorting = false;
}

// Start sorting based on selected algorithm
startButton.addEventListener("click", async () => {
    if (isSorting) return;
    isSorting = true;

    switch (algorithmSelect.value) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'quick':
            await quickSort();
            break;
        case 'merge':
            await mergeSort();
            break;
        default:
            break;
    }
});