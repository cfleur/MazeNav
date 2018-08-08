#!/usr/bin/python

"""Hexagonal grid A* with python and p5.js. Change or comment line 46 for longer or for complete path."""

import json


class Hexagon:
    """Hexagon class"""
    def __init__(self, name, q, r, s, col=(200, 100, 200)):
        self.name = name
        self.cube_loc = (q, r, s)
        self.color = col
        self.neighbours = []
        self.g = 0
        self.h = 0
        self.f = 0
        self.ring_number = 0
        # self.origin = False
        self.x = self.cube_loc[0]
        self.y = self.cube_loc[2] + (self.cube_loc[0] - (self.cube_loc[0]&1))/2


direction_vector = {"n": (0, 1, -1),
                    "ne": (1, 0, -1),
                    "se": (1, -1, 0),
                    "s": (0, -1, 1),
                    "sw": (-1, 0, 1),
                    "nw": (-1, 1, 0)}
hexagons = {}
hexagon_path = {}
total_movement = (0, 0, 0)
max_ring = max(abs(total_movement[0]), abs(total_movement[1]), abs(total_movement[2]))
outbound_path = []
current_hexagon = None


#   ==== read and process outbound directions from file ====
with open('AStarJS0/HexTiles/input.txt') as file_in:
    outbound_directions_str = file_in.read()
outbound_directions = outbound_directions_str.split(",")


#    ==== Generate outbound path (based on input directions) ====
for i, j in enumerate(outbound_directions):
    if i < 70:
        key = "%s%s%s" % (total_movement[0], total_movement[1], total_movement[2])
        hexagons[key] = (Hexagon("h%s" % (i), total_movement[0], total_movement[1], total_movement[2]))
        current_hexagon = hexagons[key]
        current_hexagon.outbound = True

        if i == 0:
            current_hexagon.color = (20, 10, 200)

        outbound_path.append((current_hexagon.x, current_hexagon.y))
        hexagons_outbound = list(hexagons.keys())   # hexagons on the path defined by the input are stored in a dictionary,
                                                    # hashed by their locations (in cube coordinates)
        this_ring = max(abs(total_movement[0]), abs(total_movement[1]), abs(total_movement[2]))
        current_hexagon.ring_number = this_ring

        if this_ring > max_ring:
            max_ring = this_ring  # maximum distance from the center

        total_movement = (total_movement[0]+direction_vector[j][0], total_movement[1]+direction_vector[j][1], total_movement[2]+direction_vector[j][2])

current_hexagon.color = (20, 100, 20)


#   ==== Get shortest path back to origin ====
shortest_path = []
start = current_hexagon
cost = (abs(start.cube_loc[0]) + abs(start.cube_loc[1]) + abs(start.cube_loc[2]))/2
current = start

while current.cube_loc != (0, 0, 0):
    if len(current.neighbours) == 0:
        for i in range(0, 6):
            if i == 0:
                neighbour_loc = (current.cube_loc[0]+direction_vector["n"][0], current.cube_loc[1]+direction_vector["n"][1], current.cube_loc[2]+direction_vector["n"][2])
                current.neighbours.append(Hexagon("h%s" % (i), neighbour_loc[0], neighbour_loc[1], neighbour_loc[2]))
            if i == 1:
                neighbour_loc = (current.cube_loc[0]+direction_vector["ne"][0], current.cube_loc[1]+direction_vector["ne"][1], current.cube_loc[2]+direction_vector["ne"][2])
                current.neighbours.append(Hexagon("h%s" % (i), neighbour_loc[0], neighbour_loc[1], neighbour_loc[2]))
            if i == 2:
                neighbour_loc = (current.cube_loc[0]+direction_vector["se"][0], current.cube_loc[1]+direction_vector["se"][1], current.cube_loc[2]+direction_vector["se"][2])
                current.neighbours.append(Hexagon("h%s" % (i), neighbour_loc[0], neighbour_loc[1], neighbour_loc[2]))
            if i == 3:
                neighbour_loc = (current.cube_loc[0]+direction_vector["s"][0], current.cube_loc[1]+direction_vector["s"][1], current.cube_loc[2]+direction_vector["s"][2])
                current.neighbours.append(Hexagon("h%s" % (i), neighbour_loc[0], neighbour_loc[1], neighbour_loc[2]))
            if i == 4:
                neighbour_loc = (current.cube_loc[0]+direction_vector["sw"][0], current.cube_loc[1]+direction_vector["sw"][1], current.cube_loc[2]+direction_vector["sw"][2])
                current.neighbours.append(Hexagon("h%s" % (i), neighbour_loc[0], neighbour_loc[1], neighbour_loc[2]))
            if i == 5:
                neighbour_loc = (current.cube_loc[0]+direction_vector["nw"][0], current.cube_loc[1]+direction_vector["nw"][1], current.cube_loc[2]+direction_vector["nw"][2])
                current.neighbours.append(Hexagon("h%s" % (i), neighbour_loc[0], neighbour_loc[1], neighbour_loc[2]))

    for i, j in enumerate(current.neighbours):
        this_cost = (abs(j.cube_loc[0]) + abs(j.cube_loc[1]) + abs(j.cube_loc[2]))/2
        key = "%s%s%s" % (current.cube_loc[0], current.cube_loc[1], current.cube_loc[2])
        if this_cost < cost:
            cost = this_cost
            current.color = (200, 200, 100)
            hexagon_path[key] = current
            hexagons_inbound = list(hexagon_path.keys())
            shortest_path.append((current.x, current.y))
            current = j


#   ==== Add other useful properties to hexagon data set ====
hexagon_data_set = {}
hexagon_data_set['details'] = {}
hexagon_data_set['details']['directions'] = direction_vector
hexagon_data_set['details']['max_ring'] = max_ring
hexagon_data_set['outbound_path'] = outbound_path
hexagon_data_set['shortest_path'] = shortest_path
# hexagon_data_set['hexagon_objects'] = hexagons # needs to be completely formatted as dict, including neighbours


#   ==== Export hexagon data set in JSON format ====
with open('AStarJS0/HexTiles/out.json', 'w') as file_out:
    json.dump(hexagon_data_set, file_out, indent=4)  # , sort_keys=True
