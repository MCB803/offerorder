package com.example.tkproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupedRoutesDTO {
    private String city;
    private List<List<TransportationResponseDTO>> routes;
}
