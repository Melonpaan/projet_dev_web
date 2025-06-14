CREATE TABLE `movies` (
    `id` int NOT NULL,
    `title` varchar(255) DEFAULT NULL,
    `adult` boolean DEFAULT NULL,
    `backdrop_path` varchar(255) DEFAULT NULL,
    `original_language` varchar(10) DEFAULT NULL,
    `original_title` varchar(255) DEFAULT NULL,
    `overview` text,
    `popularity` float DEFAULT NULL,
    `poster_path` varchar(255) DEFAULT NULL,
    `release_date` date DEFAULT NULL,
    `vote_average_top_rated` float DEFAULT NULL,
    `vote_count` int DEFAULT NULL,
    `revenue` bigint DEFAULT NULL,
    `runtime` int DEFAULT NULL,
    `tagline` text,
    `youtube_url` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `genres` (
    `id` int NOT NULL,
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `movie_genres` (
    `movie_id` int NOT NULL,
    `genre_id` int NOT NULL,
    PRIMARY KEY (`movie_id`, `genre_id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
    FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `email` varchar(100) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `first_name` varchar(50) DEFAULT NULL,
    `last_name` varchar(50) DEFAULT NULL,
    `date_of_birth` date DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_list` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `movie_id` int NOT NULL,
    `status` varchar(10) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_user_movie` (`user_id`,`movie_id`),
    KEY `movie_id` (`movie_id`),
    CONSTRAINT `user_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `user_list_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comments` (
    `id` bigint unsigned NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `movie_id` int NOT NULL,
    `content` text NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `parent_comment_id` bigint unsigned DEFAULT NULL,
    `likes_count` int DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
    FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; 