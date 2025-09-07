from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from sqlmodel import select

from app.core.db import SessionDep
from app.models.doc import Hero

router = APIRouter(prefix='/heroes', tags=['heroes'])


@router.post('/')
def create_hero(hero: Hero, session: SessionDep) -> Hero:
	session.add(hero)
	session.commit()
	session.refresh(hero)
	return hero


@router.get('/')
def read_heroes(
	session: SessionDep,
	offset: int = 0,
	limit: Annotated[int, Query(le=100)] = 100,
) -> list[Hero]:
	heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
	return heroes


@router.get('/{hero_id}')
def read_hero(hero_id: int, session: SessionDep) -> Hero:
	hero = session.get(Hero, hero_id)
	if not hero:
		raise HTTPException(status_code=404, detail='Hero not found')
	return hero


@router.delete('/{hero_id}')
def delete_hero(hero_id: int, session: SessionDep):
	hero = session.get(Hero, hero_id)
	if not hero:
		raise HTTPException(status_code=404, detail='Hero not found')
	session.delete(hero)
	session.commit()
	return {'ok': True}
