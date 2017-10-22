#!/usr/bin/python
import random

def randObsticals(blockedCells, grid):
    i = 0
    while i < blockedCells:
        for y in range(len(grid)):
            for x in range(len(grid[y])):
                rx = random.randint(0, len(grid[y]))
                ry = random.randint(0, len(grid))
                if y == ry:
                    if x == rx:
                        if grid[y][x] != "x":
                            grid[y][x] = "x"
                            i += 1
                            if i >= blockedCells:
                                return
def printGrid(grid):
    for y in range(len(grid)):
        for x in range(len(grid[y])):
            print(grid[y][x], " ", end='')
        print()
    

def gridSpace(xAxis, yAxis, blockedCells):
    grid = [["o" for x in range(xAxis)] for y in range(yAxis)]
    randObsticals(blockedCells, grid)
    return grid


def StartEnd(grid): # get start point and end point
    print ('Enter coordinates of starting point in the form "column row" (top left is 0 0)')
    s = input('> ')
    s = str.split(s)
    for i in range(len(s)):
        s[i] = int(s[i])
    print ('Enter coordinates of ending point in the form "column row" (top left is 0 0)')
    e = input('> ')
    e = str.split(e)
    for i in range(len(e)):
        e[i] = int(e[i])
    print(e,s)
    grid[s[1]][s[0]] = 's'
    grid[e[1]][e[0]] = 'e'
    return grid


def main():
    x = int(input("Enter number of columns (x axis): "))
    y = int(input("Enter number of rows (y axis): "))
    blockedCells = int(input("Enter number of cells to be blocked: "))
    grid = gridSpace(x,y,blockedCells) # x, y, num of blocked cells (random position)
    printGrid(grid)
    gridSE = StartEnd(grid)
    printGrid(gridSE)

if __name__ == "__main__": main()
