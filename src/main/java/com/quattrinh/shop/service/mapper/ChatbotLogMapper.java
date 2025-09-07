package com.quattrinh.shop.service.mapper;

import com.quattrinh.shop.domain.ChatbotLog;
import com.quattrinh.shop.domain.User;
import com.quattrinh.shop.service.dto.ChatbotLogDTO;
import com.quattrinh.shop.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ChatbotLog} and its DTO {@link ChatbotLogDTO}.
 */
@Mapper(componentModel = "spring")
public interface ChatbotLogMapper extends EntityMapper<ChatbotLogDTO, ChatbotLog> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    ChatbotLogDTO toDto(ChatbotLog s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
